/**
 * @module RunHandler
 * Manages the real-time execution of standalone MIPS assembly code via the MARS simulator.
 */

import { Socket } from 'socket.io';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { normalizeSpimToMars } from '../services/parser.js';
import { interceptMarsError, safeDeleteFile } from './utils.js';

const tempDir = path.join(os.tmpdir(), 'mips_evaluator_temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

/**
 * Registers event listeners on the provided socket to handle the compilation, 
 * execution, and termination of standard MIPS code sessions.
 * @param socket - The active client socket connection.
 */
export const setupRunHandler = (socket: Socket) => {
  let marsProcess: ChildProcessWithoutNullStreams | null = null;
  let currentTempPath = '';

  socket.on("start_run", async (code: string) => {
    if (marsProcess) marsProcess.kill('SIGKILL');

    let cleanCode = code.replace(/_EVALUADOR_/g, '');
    cleanCode = normalizeSpimToMars(cleanCode);

    const fileName = `run_${socket.id}_${Date.now()}.s`;
    currentTempPath = path.join(tempDir, fileName);
    
    await fs.promises.writeFile(currentTempPath, cleanCode);

    const marsPath = path.join(process.cwd(), 'bin', 'Mars45.jar'); 
    
    marsProcess = spawn('java', ['-jar', marsPath, 'nc', fileName], { cwd: tempDir });

    marsProcess.on('error', (err: Error) => socket.emit("output", `\r\n\x1b[31m[ERROR]: ${err.message}\x1b[0m\r\n`));
    marsProcess.stdout.on('data', (data: Buffer) => socket.emit("output", data.toString()));
    marsProcess.stderr.on('data', (data: Buffer) => socket.emit("output", interceptMarsError(data)));

    marsProcess.on('close', async (code: number) => {
      socket.emit("execution_finished", code);
      await safeDeleteFile(currentTempPath);
    });
  });

  socket.on("input", (data: string) => {
    if (marsProcess && marsProcess.stdin) marsProcess.stdin.write(data);
  });

  socket.on("disconnect", async () => {
    if (marsProcess) marsProcess.kill('SIGKILL');
    await safeDeleteFile(currentTempPath);
  });
};