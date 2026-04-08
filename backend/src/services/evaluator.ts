import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { normalizeSpimToMars } from './parser.js';

export interface ExecutionCodes {
    finalStudentCode: string;
    finalTeacherCode: string;
}

export interface EvaluationResult {
    resultado: string;
    error: string;
    timeout: boolean;
}

const tempDir = path.join(os.tmpdir(), 'mips_evaluator_temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

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

const executeMarsJar = (filePath: string, inputs: string[], timeoutMs: number): Promise<EvaluationResult> => {
    return new Promise((resolve, reject) => {
        const marsPath = path.join(process.cwd(), 'bin', 'Mars45.jar');
        const child = spawn('java', ['-jar', marsPath, 'nc', path.basename(filePath)], { cwd: tempDir });

        let stdoutData: string[] = [];
        let stderrData: string[] = [];
        let killedByTimeout = false;

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
                resultado: stdoutData.join(''),
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