import { Socket } from 'socket.io';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { normalizeSpimToMars } from '../services/parser.js';
import { interceptMarsError } from './utils.js';

const tempDir = path.join(os.tmpdir(), 'mips_evaluator_temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

export const setupRunHandler = (socket: Socket) => {
  let marsProcess: any = null;
  let currentTempPath = '';

  socket.on("start_run", (code: string) => {
    if (marsProcess) marsProcess.kill('SIGKILL');

    let cleanCode = code.replace(/_EVALUADOR_/g, '');
    cleanCode = normalizeSpimToMars(cleanCode);

    const fileName = `run_${socket.id}_${Date.now()}.s`;
    currentTempPath = path.join(tempDir, fileName);
    fs.writeFileSync(currentTempPath, cleanCode);

    const marsPath = path.join(process.cwd(), 'bin', 'Mars45.jar'); 
    
    marsProcess = spawn('java', ['-jar', marsPath, 'nc', fileName], { cwd: tempDir });

    marsProcess.on('error', (err: any) => socket.emit("output", `\r\n\x1b[31m[ERROR]: ${err.message}\x1b[0m\r\n`));
    marsProcess.stdout.on('data', (data: Buffer) => socket.emit("output", data.toString()));
    marsProcess.stderr.on('data', (data: Buffer) => socket.emit("output", interceptMarsError(data)));

    marsProcess.on('close', (code: number) => {
      socket.emit("execution_finished", code);
      if (fs.existsSync(currentTempPath)) fs.unlinkSync(currentTempPath);
    });
  });

  socket.on("input", (data: string) => {
    if (marsProcess && marsProcess.stdin) marsProcess.stdin.write(data);
  });

  socket.on("disconnect", () => {
    if (marsProcess) marsProcess.kill('SIGKILL');
    if (fs.existsSync(currentTempPath)) fs.unlinkSync(currentTempPath);
  });
};