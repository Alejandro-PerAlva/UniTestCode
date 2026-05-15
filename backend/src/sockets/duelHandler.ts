/**
 * @module DuelHandler
 * Orchestrates the "Duel Mode", single-test execution, and batch test evaluations.
 * Handles the parallel execution of the student's code and the teacher's reference code,
 * as well as the validation of MIPS assembly against predefined test suites.
 */

import { Socket } from 'socket.io';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { prisma } from '../services/db.js';
import { buildExecutionCodes, evaluateMips } from '../services/evaluator.js';
import { interceptMarsError, safeDeleteFile } from './utils.js';

const tempDir = path.join(os.tmpdir(), 'mips_evaluator_temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

/**
 * Interface defining the expected structure for incoming evaluation requests.
 */
interface EvaluationPayload {
  studentCode: string;
  exerciseId: number;
  testIndex?: number;
  targetFunction?: string;
}

/**
 * Registers event listeners for parallel code execution (Duel) and test case validations.
 * Safely manages multiple child processes and ensures proper cleanup upon completion.
 * * @param {Socket} socket - The active client socket connection.
 */
export const setupDuelHandler = (socket: Socket): void => {
  let duelStudentProcess: ChildProcessWithoutNullStreams | null = null;
  let duelTeacherProcess: ChildProcessWithoutNullStreams | null = null;
  let duelStudentPath = '';
  let duelTeacherPath = '';

  socket.on("start_duel", async ({ studentCode, exerciseId, targetFunction }: EvaluationPayload) => {
    if (duelStudentProcess) duelStudentProcess.kill('SIGKILL');
    if (duelTeacherProcess) duelTeacherProcess.kill('SIGKILL');

    const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
    if (!exercise) return;

    let finalStudentCode = "";
    let finalTeacherCode = "";

    try {
      const codeToUse = exercise.teacherCodeMars || exercise.teacherCode || "";
      const codes = buildExecutionCodes(studentCode, codeToUse, targetFunction);
      finalStudentCode = codes.finalStudentCode;
      finalTeacherCode = codeToUse;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during code preparation.';
      socket.emit("duel_student_output", `\r\n\x1b[31m[ERROR]: ${errorMessage}\x1b[0m\r\n`);
      socket.emit("duel_student_finished");
      return;
    }

    const studentFileName = `ds_${socket.id}_${Date.now()}.s`;
    const teacherFileName = `dt_${socket.id}_${Date.now()}.s`;

    duelStudentPath = path.join(tempDir, studentFileName);
    duelTeacherPath = path.join(tempDir, teacherFileName);

    await fs.promises.writeFile(duelStudentPath, finalStudentCode);
    await fs.promises.writeFile(duelTeacherPath, finalTeacherCode);

    const marsPath = path.join(process.cwd(), 'bin', 'Mars45.jar'); 

    duelStudentProcess = spawn('java', ['-jar', marsPath, 'nc', studentFileName], { cwd: tempDir });
    duelTeacherProcess = spawn('java', ['-jar', marsPath, 'nc', teacherFileName], { cwd: tempDir });

    duelStudentProcess.stdout.on('data', (data: Buffer) => socket.emit("duel_student_output", data.toString()));
    duelStudentProcess.stderr.on('data', (data: Buffer) => socket.emit("duel_student_output", interceptMarsError(data)));

    duelTeacherProcess.stdout.on('data', (data: Buffer) => socket.emit("duel_teacher_output", data.toString()));
    duelTeacherProcess.stderr.on('data', (data: Buffer) => socket.emit("duel_teacher_output", interceptMarsError(data)));

    duelStudentProcess.on('close', async () => {
      socket.emit("duel_student_finished");
      await safeDeleteFile(duelStudentPath);
    });

    duelTeacherProcess.on('close', async () => {
      socket.emit("duel_teacher_finished");
      await safeDeleteFile(duelTeacherPath);
    });
  });

  socket.on("duel_input", (data: string) => {
    if (duelStudentProcess && duelStudentProcess.stdin) duelStudentProcess.stdin.write(data);
    if (duelTeacherProcess && duelTeacherProcess.stdin) duelTeacherProcess.stdin.write(data);
    
    socket.emit("duel_teacher_output", `\x1b[32m${data}\x1b[0m`);
  });

  socket.on("stop_duel", () => {
    if (duelStudentProcess) duelStudentProcess.kill('SIGKILL');
    if (duelTeacherProcess) duelTeacherProcess.kill('SIGKILL');
  });

  socket.on("disconnect", async () => {
    if (duelStudentProcess) duelStudentProcess.kill('SIGKILL');
    if (duelTeacherProcess) duelTeacherProcess.kill('SIGKILL');
    await safeDeleteFile(duelStudentPath);
    await safeDeleteFile(duelTeacherPath);
  });

  socket.on("run_single_test", async ({ studentCode, exerciseId, testIndex }: EvaluationPayload) => {
    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: { tests: true } 
      });

      if (!exercise || !exercise.tests || testIndex === undefined || !exercise.tests[testIndex]) {
        socket.emit('single_test_result', { passed: false, error: 'Test case not found.', testIndex });
        return;
      }

      const test = exercise.tests[testIndex];
      let finalStudentCode = "";

      try {
        const codeToUse = exercise.teacherCodeMars || exercise.teacherCode || "";
        
        // Type-safe property extraction without using 'any'
        const targetFn = 'targetFunction' in exercise 
          ? (exercise as Record<string, unknown>).targetFunction as string 
          : undefined;
          
        const codes = buildExecutionCodes(studentCode, codeToUse, targetFn);
        finalStudentCode = codes.finalStudentCode;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error.';
        socket.emit("single_test_result", {
          passed: false,
          error: `Code preparation error: ${errorMessage}`,
          testIndex,
          originalTest: test
        });
        return;
      }

      const inputs = test.inputs ? test.inputs.split('\n').filter(Boolean) : [];
      const result = await evaluateMips(finalStudentCode, inputs);

      const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();
      const passed = normalize(result.output) === normalize(test.expected);

      socket.emit('single_test_result', {
        passed,
        expected: test.expected,
        output: result.output,
        error: result.error,
        testIndex,
        originalTest: test
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown critical error.';
      socket.emit('single_test_result', {
        passed: false,
        error: `Critical execution error: ${errorMessage}`,
        testIndex,
        originalTest: null
      });
    }
  });

  /**
   * Evaluates all unit tests sequentially for a given exercise and emits a comprehensive summary.
   */
  socket.on("run_all_tests", async ({ studentCode, exerciseId }: EvaluationPayload) => {
    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: { tests: true }
      });

      if (!exercise || !exercise.tests || exercise.tests.length === 0) {
        socket.emit('all_tests_result', {
          success: false,
          allPassed: false,
          error: 'Exercise or tests not found.',
          exerciseId: String(exerciseId),
          totalTests: 0,
          passedCount: 0,
          results: []
        });
        return;
      }

      let finalStudentCode = "";

      try {
        const codeToUse = exercise.teacherCodeMars || exercise.teacherCode || "";
        
        // Type-safe property extraction
        const targetFn = 'targetFunction' in exercise 
          ? (exercise as Record<string, unknown>).targetFunction as string 
          : undefined;

        const codes = buildExecutionCodes(studentCode, codeToUse, targetFn);
        finalStudentCode = codes.finalStudentCode;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error.';
        socket.emit("all_tests_result", {
          success: false,
          allPassed: false,
          error: `Code preparation error: ${errorMessage}`,
          exerciseId: String(exerciseId),
          totalTests: exercise.tests.length,
          passedCount: 0,
          results: []
        });
        return;
      }

      const results = [];
      let passedCount = 0;
      const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();

      // Sequentially evaluate each test case
      for (const test of exercise.tests) {
        const inputs = test.inputs ? test.inputs.split('\n').filter(Boolean) : [];
        const evalResult = await evaluateMips(finalStudentCode, inputs);
        
        const passed = normalize(evalResult.output) === normalize(test.expected);
        if (passed) passedCount++;

        results.push({
          testId: test.id,
          passed,
          expectedOutput: test.expected,
          actualOutput: evalResult.output
        });
      }

      // Emit the comprehensive batch result payload
      socket.emit('all_tests_result', {
        success: true,
        allPassed: passedCount === exercise.tests.length,
        exerciseId: String(exerciseId),
        totalTests: exercise.tests.length,
        passedCount,
        results
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown critical error.';
      socket.emit('all_tests_result', {
        success: false,
        allPassed: false,
        error: `Critical execution error: ${errorMessage}`,
        exerciseId: String(exerciseId),
        totalTests: 0,
        passedCount: 0,
        results: []
      });
    }
  });
};