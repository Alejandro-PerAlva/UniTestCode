/**
 * @module EvaluatorService
 * Orchestrates the execution of MIPS assembly code using the MARS simulator.
 * Handles process isolation, code merging, and file system cleanup.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { normalizeSpimToMars } from './parser.js';

/**
 * Represents the final, merged MIPS assembly codes ready for execution.
 */
export interface ExecutionCodes {
    finalStudentCode: string;
    finalTeacherCode: string;
}

/**
 * Represents the outcome of a MARS simulator execution.
 */
export interface EvaluationResult {
    output: string;
    error: string;
    timeout: boolean;
}

const tempDir = path.join(os.tmpdir(), 'mips_evaluator_temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

/**
 * Merges the student's submission with the teacher's template to create a runnable MIPS file.
 * Handles specific function extraction or full template injection based on placeholders.
 * @param studentCode - The raw MIPS code submitted by the student.
 * @param teacherCode - The reference MIPS code or evaluation template provided by the teacher.
 * @param targetFunction - (Optional) The specific label/function to extract from the student's code.
 * @returns An object containing both the ready-to-run student code and teacher code.
 * @throws {Error} If the target function label cannot be found in the respective codes.
 */
export const buildExecutionCodes = (studentCode: string, teacherCode: string, targetFunction?: string): ExecutionCodes => {
    let finalStudentCode = studentCode;
    let finalTeacherCode = teacherCode;

    let detectedFunction = targetFunction?.trim();

    if (!detectedFunction) {
        const regex = /^([a-zA-Z_]\w*)\s*:[\s\S]*?^\1(?:_fin|__MARCAFIN)\s*:/im;
        const match = studentCode.match(regex);
        if (match) detectedFunction = match[1]; 
    }

    if (detectedFunction && detectedFunction.trim() !== '') {
        const studentLines = studentCode.split(/\r?\n/);
        const teacherLines = teacherCode.split(/\r?\n/);

        const startRegex = new RegExp(`^[ \\t]*${detectedFunction}[ \\t]*:`, 'i');
        const endRegex = new RegExp(`^[ \\t]*${detectedFunction}(_fin|__MARCAFIN)[ \\t]*:`, 'i');

        const getIndexes = (lines: string[]) => {
            const start = lines.findIndex(l => startRegex.test(l));
            const end = lines.findIndex(l => endRegex.test(l));
            return { start, end: end === -1 ? lines.length - 1 : end };
        };

        const studentCoords = getIndexes(studentLines);
        if (studentCoords.start === -1) throw new Error(`No se encontró la etiqueta de inicio en tu código.`);

        const teacherCoords = getIndexes(teacherLines);
        if (teacherCoords.start === -1) throw new Error(`El código del alumno contiene la función '${detectedFunction}', pero no se encontró en el código del profesor.`);

        const studentBlock = studentLines.slice(studentCoords.start, studentCoords.end + 1);
        
        finalStudentCode = [
            ...teacherLines.slice(0, teacherCoords.start),
            ...studentBlock,
            ...teacherLines.slice(teacherCoords.end + 1)
        ].join('\n');
        
        finalTeacherCode = teacherCode;
    } 
    else if (teacherCode.includes('_EVALUADOR_')) {
        const parts = teacherCode.split('_EVALUADOR_');
        finalTeacherCode = parts[0] + '\n\n' + parts[1];
        finalStudentCode = studentCode + '\n\n' + parts[1];
    }

    finalStudentCode = normalizeSpimToMars(finalStudentCode.replace(/_EVALUADOR_/g, ''));
    finalTeacherCode = finalTeacherCode.replace(/_EVALUADOR_/g, '');

    return { finalStudentCode, finalTeacherCode };
};

/**
 * Spawns a Java child process to run the MARS 4.5 simulator against a given file.
 * @param filePath - The absolute path to the temporary `.s` file.
 * @param inputs - An array of strings representing the stdin inputs for the program.
 * @param timeoutMs - Maximum execution time in milliseconds before forcefully killing the process.
 * @returns A promise resolving to the standard output, error output, and timeout status.
 */
const executeMarsJar = (filePath: string, inputs: string[], timeoutMs: number): Promise<EvaluationResult> => {
    return new Promise((resolve, reject) => {
        const marsPath = path.join(process.cwd(), 'bin', 'Mars45.jar');
        const child = spawn('java', ['-jar', marsPath, 'nc', path.basename(filePath)], { cwd: tempDir });

        let stdoutData: string[] = [];
        let stderrData: string[] = [];
        let killedByTimeout = false;

        // Failsafe timer to prevent infinite loops (e.g., missing branch conditions) from hanging the server
        const timer = setTimeout(() => {
            killedByTimeout = true;
            child.kill('SIGKILL');
        }, timeoutMs);

        if (inputs.length > 0) {
            child.stdin.write(inputs.join('\n') + '\n');
            child.stdin.end();
        }

        child.stdout.on('data', (data) => stdoutData.push(data.toString()));
        child.stderr.on('data', (data) => stderrData.push(data.toString()));

        child.on('close', () => {
            clearTimeout(timer);
            resolve({
                output: stdoutData.join(''),
                error: stderrData.join(''),
                timeout: killedByTimeout
            });
        });

        child.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
};

/**
 * Writes the MIPS source code to a temporary file, executes it via the MARS simulator,
 * and guarantees the cleanup of the temporary file regardless of execution success or failure.
 * @param sourceCode - The fully assembled MIPS code to execute.
 * @param inputs - (Optional) Stdin inputs for the simulated program.
 * @param timeout - (Optional) Execution timeout limit in milliseconds. Defaults to 3000ms.
 * @returns A promise resolving to the evaluation result.
 */
export const evaluateMips = async (sourceCode: string, inputs: string[] = [], timeout = 3000): Promise<EvaluationResult> => {
    const fileName = `eval_${Date.now()}_${Math.random().toString(36).substring(2, 11)}.s`;
    const filePath = path.join(tempDir, fileName);
    
    await fs.promises.writeFile(filePath, sourceCode);

    try {
        return await executeMarsJar(filePath, inputs, timeout);
    } finally {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath).catch(() => {});
        }
    }
};