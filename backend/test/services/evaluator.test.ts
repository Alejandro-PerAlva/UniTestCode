/**
 * @module EvaluatorServiceTests
 * @description Unit tests for MIPS code merging and isolated MARS simulator execution.
 */

import { buildExecutionCodes, evaluateMips } from '../../src/services/evaluator.js';
import * as childProcess from 'child_process';
import fs from 'fs';

jest.mock('child_process');
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
    unlink: jest.fn()
  }
}));

jest.mock('../../src/services/parser.js', () => ({
  normalizeSpimToMars: (code: string) => code
}));

describe('Evaluator Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildExecutionCodes', () => {
    it('should extract a targeted function and merge it into the teacher code', () => {
      const studentCode = `ignore_this\ntarget:\ncode A\ntarget_fin:\nignore_that`;
      const teacherCode = `prefix\ntarget:\nold code\ntarget_fin:\nsuffix`;
      
      const result = buildExecutionCodes(studentCode, teacherCode, 'target');
      
      expect(result.finalStudentCode).toContain('prefix\ntarget:\ncode A\ntarget_fin:\nsuffix');
      expect(result.finalTeacherCode).toBe(teacherCode);
    });

    it('should automatically detect the function if no target is provided', () => {
      const studentCode = `my_func:\ncode\nmy_func__MARCAFIN:`;
      const teacherCode = `my_func:\nold\nmy_func__MARCAFIN:`;
      
      const result = buildExecutionCodes(studentCode, teacherCode);
      
      expect(result.finalStudentCode).toContain('my_func:\ncode\nmy_func__MARCAFIN:');
    });

    it('should throw an error if the detected function start label is missing in student code', () => {
      const studentCode = `no label here`;
      const teacherCode = `target:\ntarget_fin:`;
      expect(() => buildExecutionCodes(studentCode, teacherCode, 'target')).toThrow(/No se encontró la etiqueta de inicio/);
    });

    it('should throw an error if the function exists in student code but not in teacher code', () => {
      const studentCode = `target:\ntarget_fin:`;
      const teacherCode = `no label here`;
      expect(() => buildExecutionCodes(studentCode, teacherCode, 'target')).toThrow(/pero no se encontró en el código del profesor/);
    });

    it('should merge using the _EVALUADOR_ fallback tag if no functions are targeted', () => {
      // Simplified strings to prevent cross-platform newline counting issues
      const studentCode = `student logic`;
      const teacherCode = `teacher part 1_EVALUADOR_teacher part 2`;
      
      const result = buildExecutionCodes(studentCode, teacherCode);
      
      expect(result.finalStudentCode).toBe(`student logic\n\nteacher part 2`);
      expect(result.finalTeacherCode).toBe(`teacher part 1\n\nteacher part 2`);
    });

    it('should return raw codes if neither target nor fallback tag is detected', () => {
      const studentCode = `plain student code`;
      const teacherCode = `plain teacher code`;
      
      const result = buildExecutionCodes(studentCode, teacherCode);
      
      expect(result.finalStudentCode).toBe(`plain student code`);
      expect(result.finalTeacherCode).toBe(`plain teacher code`);
    });
  });

  describe('evaluateMips', () => {
    let mockChildProcess: any;

    beforeEach(() => {
      mockChildProcess = {
        stdin: { write: jest.fn(), end: jest.fn() },
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn(),
        kill: jest.fn()
      };
      (childProcess.spawn as jest.Mock).mockReturnValue(mockChildProcess);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should successfully execute MARS and resolve with standard output', async () => {
      mockChildProcess.stdout.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'data') cb(Buffer.from('success output'));
      });
      mockChildProcess.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') cb(); 
      });

      const result = await evaluateMips('mips code', ['input1', 'input2']);
      
      expect(fs.promises.writeFile).toHaveBeenCalled();
      expect(mockChildProcess.stdin.write).toHaveBeenCalledWith('input1\ninput2\n');
      expect(result.output).toBe('success output');
      expect(result.error).toBe('');
      expect(result.timeout).toBe(false);
      expect(fs.promises.unlink).toHaveBeenCalled();
    });

    it('should capture stderr on failure and reject if process errors', async () => {
      mockChildProcess.stderr.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'data') cb(Buffer.from('compilation error'));
      });
      
      mockChildProcess.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'error') cb(new Error('Process crash')); 
      });

      await expect(evaluateMips('bad code')).rejects.toThrow('Process crash');
      expect(fs.promises.unlink).toHaveBeenCalled();
    });

    it('should handle timeout, kill the process, and flag the result', async () => {
      let closeCallback: Function | undefined;
      
      mockChildProcess.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') closeCallback = cb;
      });

      mockChildProcess.kill.mockImplementation(() => {
        if (closeCallback) closeCallback();
      });

      const result = await evaluateMips('infinite loop code', [], 10);

      expect(mockChildProcess.kill).toHaveBeenCalledWith('SIGKILL');
      expect(result.timeout).toBe(true);
    });

    it('should not throw if unlinking the temporary file fails', async () => {
      mockChildProcess.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') cb(); 
      });
      (fs.promises.unlink as jest.Mock).mockRejectedValue(new Error('Locked'));

      const result = await evaluateMips('code');
      
      expect(result.output).toBe(''); 
    });

    it('should skip unlinking if the temporary file does not exist', async () => {
      mockChildProcess.on.mockImplementation((event: string, cb: Function) => {
        if (event === 'close') cb(); 
      });
      // Force existsSync to false to cover the negative branch
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await evaluateMips('code');
      
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });
  });
});