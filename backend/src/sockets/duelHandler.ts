/**
 * @module DuelHandler
 * Orchestrates the "Duel Mode" and single-test execution features.
 * Handles the parallel execution of the student's code and the teacher's reference code.
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
 * Registers event listeners for parallel code execution (Duel) and individual test case validation.
 * Safely manages multiple child processes and ensures proper cleanup upon completion or disconnection.
 * * @param socket - The active client socket connection.
 */
export const setupDuelHandler = (socket: Socket) => {
  let duelStudentProcess: ChildProcessWithoutNullStreams | null = null;
  let duelTeacherProcess: ChildProcessWithoutNullStreams | null = null;
  let duelStudentPath = '';
  let duelTeacherPath = '';

  socket.on("start_duel", async ({ studentCode, exerciseId, targetFunction }) => {
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
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
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

  socket.on("run_single_test", async ({ studentCode, exerciseId, testIndex }) => {
    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: { tests: true } 
      });

      if (!exercise || !exercise.tests || !exercise.tests[testIndex]) {
        socket.emit('single_test_result', { passed: false, error: 'Test no encontrado', testIndex });
        return;
      }

      const test = exercise.tests[testIndex];
      let finalStudentCode = "";

      try {
        const codeToUse = exercise.teacherCodeMars || exercise.teacherCode || "";
        // Temporary type assertion required to support legacy frontend implementations
        const targetFn = (exercise as any).targetFunction || undefined; 
        const codes = buildExecutionCodes(studentCode, codeToUse, targetFn);
        finalStudentCode = codes.finalStudentCode;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        socket.emit("single_test_result", {
          passed: false,
          error: `Error al preparar el código: ${errorMessage}`,
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
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      socket.emit('single_test_result', {
        passed: false,
        error: `Error crítico de ejecución: ${errorMessage}`,
        testIndex,
        originalTest: null
      });
    }
  });
};