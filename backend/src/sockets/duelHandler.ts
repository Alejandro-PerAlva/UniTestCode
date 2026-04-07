import { Socket } from 'socket.io';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { prisma } from '../services/db.js';
// IMPORTANTE: Añadida la importación de evaluateMips
import { buildExecutionCodes, evaluateMips } from '../services/evaluator.js';
import { interceptMarsError } from './utils.js';

const tempDir = path.join(os.tmpdir(), 'mips_evaluator_temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

export const setupDuelHandler = (socket: Socket) => {
  let duelStudentProcess: any = null;
  let duelTeacherProcess: any = null;
  let duelStudentPath = '';
  let duelTeacherPath = '';

  // --- LÓGICA EXISTENTE DEL DUELO (INTACTA) ---
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
    } catch (err: any) {
      socket.emit("duel_student_output", `\r\n\x1b[31m[ERROR]: ${err.message}\x1b[0m\r\n`);
      socket.emit("duel_student_finished");
      return;
    }

    const studentFileName = `ds_${socket.id}_${Date.now()}.s`;
    const teacherFileName = `dt_${socket.id}_${Date.now()}.s`;

    duelStudentPath = path.join(tempDir, studentFileName);
    duelTeacherPath = path.join(tempDir, teacherFileName);

    fs.writeFileSync(duelStudentPath, finalStudentCode);
    fs.writeFileSync(duelTeacherPath, finalTeacherCode);

    const marsPath = path.join(process.cwd(), 'bin', 'Mars45.jar'); 

    duelStudentProcess = spawn('java', ['-jar', marsPath, 'nc', studentFileName], { cwd: tempDir });
    duelTeacherProcess = spawn('java', ['-jar', marsPath, 'nc', teacherFileName], { cwd: tempDir });

    duelStudentProcess.stdout.on('data', (data: Buffer) => socket.emit("duel_student_output", data.toString()));
    duelStudentProcess.stderr.on('data', (data: Buffer) => socket.emit("duel_student_output", interceptMarsError(data)));

    duelTeacherProcess.stdout.on('data', (data: Buffer) => socket.emit("duel_teacher_output", data.toString()));
    duelTeacherProcess.stderr.on('data', (data: Buffer) => socket.emit("duel_teacher_output", interceptMarsError(data)));

    duelStudentProcess.on('close', () => {
      socket.emit("duel_student_finished");
      if (fs.existsSync(duelStudentPath)) fs.unlinkSync(duelStudentPath);
    });

    duelTeacherProcess.on('close', () => {
      socket.emit("duel_teacher_finished");
      if (fs.existsSync(duelTeacherPath)) fs.unlinkSync(duelTeacherPath);
    });
  });

  socket.on("duel_input", (data: string) => {
    if (duelStudentProcess && duelStudentProcess.stdin) duelStudentProcess.stdin.write(data);
    if (duelTeacherProcess && duelTeacherProcess.stdin) duelTeacherProcess.stdin.write(data);
  });

  socket.on("stop_duel", () => {
    if (duelStudentProcess) duelStudentProcess.kill('SIGKILL');
    if (duelTeacherProcess) duelTeacherProcess.kill('SIGKILL');
  });

  socket.on("disconnect", () => {
    if (duelStudentProcess) duelStudentProcess.kill('SIGKILL');
    if (duelTeacherProcess) duelTeacherProcess.kill('SIGKILL');
    if (fs.existsSync(duelStudentPath)) fs.unlinkSync(duelStudentPath);
    if (fs.existsSync(duelTeacherPath)) fs.unlinkSync(duelTeacherPath);
  });

  // --- NUEVA LÓGICA: EJECUCIÓN AISLADA DE UN TEST ---
  socket.on("run_single_test", async ({ studentCode, exerciseId, testIndex }) => {
    try {
      // Cargamos el ejercicio con sus tests
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        include: { tests: true } // Extrae los tests asociados
      });

      // Validaciones de seguridad
      if (!exercise || !exercise.tests || !exercise.tests[testIndex]) {
        socket.emit('single_test_result', { passed: false, error: 'Test no encontrado', testIndex });
        return;
      }

      const test = exercise.tests[testIndex];
      let finalStudentCode = "";

      // 1. Preparación del código (Trasplante si existe etiqueta mágica o _EVALUADOR_)
      try {
        const codeToUse = exercise.teacherCodeMars || exercise.teacherCode || "";
        // Nota: any casteo rápido por si targetFunction no está tipado en este modelo local
        const targetFn = (exercise as any).targetFunction || undefined; 
        const codes = buildExecutionCodes(studentCode, codeToUse, targetFn);
        finalStudentCode = codes.finalStudentCode;
      } catch (err: any) {
        socket.emit("single_test_result", {
          passed: false,
          error: `Error al preparar el código: ${err.message}`,
          testIndex,
          originalTest: test
        });
        return;
      }

      // 2. Ejecución aislada con evaluateMips
      const inputs = test.inputs ? test.inputs.split('\n').filter(Boolean) : [];
      const result = await evaluateMips(finalStudentCode, inputs);

      // 3. Comparación estricta
      const normalize = (str: string) => str.replace(/\r\n/g, '\n').trim();
      const passed = normalize(result.resultado) === normalize(test.expected);

      // 4. Devolver resultado al frontend
      socket.emit('single_test_result', {
        passed,
        expected: test.expected,
        output: result.resultado,
        error: result.error,
        testIndex,
        originalTest: test
      });

    } catch (err: any) {
      socket.emit('single_test_result', {
        passed: false,
        error: `Error crítico de ejecución: ${err.message}`,
        testIndex,
        originalTest: null
      });
    }
  });
};