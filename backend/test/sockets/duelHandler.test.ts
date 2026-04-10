/**
 * @module DuelHandlerTests
 * @description Unit tests for parallel execution and evaluation logic in real-time.
 */

import { Socket } from 'socket.io';
import { spawn } from 'child_process';
import fs from 'fs';
import { setupDuelHandler } from '../../src/sockets/duelHandler.js';
import { prisma } from '../../src/services/db.js';
import { buildExecutionCodes, evaluateMips } from '../../src/services/evaluator.js';

jest.mock('child_process');
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    unlink: jest.fn().mockResolvedValue(undefined)
  }
}));

jest.mock('../../src/services/db', () => ({
  prisma: {
    exercise: { findUnique: jest.fn() }
  }
}));

jest.mock('../../src/services/evaluator', () => ({
  buildExecutionCodes: jest.fn(),
  evaluateMips: jest.fn()
}));

describe('Duel Handler', () => {
  let mockSocket: Partial<Socket>;
  let socketEvents: Record<string, Function>;
  let mockStudentProcess: any;
  let mockTeacherProcess: any;

  beforeEach(() => {
    socketEvents = {};
    mockSocket = {
      id: 'test-id',
      on: jest.fn().mockImplementation((event: string, cb: Function) => {
        socketEvents[event] = cb;
        return mockSocket;
      }),
      emit: jest.fn()
    };

    mockStudentProcess = { kill: jest.fn(), stdin: { write: jest.fn() }, stdout: { on: jest.fn() }, stderr: { on: jest.fn() }, on: jest.fn() };
    mockTeacherProcess = { kill: jest.fn(), stdin: { write: jest.fn() }, stdout: { on: jest.fn() }, stderr: { on: jest.fn() }, on: jest.fn() };

    (spawn as jest.Mock).mockReset();
    (spawn as jest.Mock)
      .mockReturnValueOnce(mockStudentProcess)
      .mockReturnValueOnce(mockTeacherProcess)
      .mockReturnValue(mockStudentProcess);

    jest.clearAllMocks();
  });

  it('should create temp directory if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    jest.isolateModules(() => {
      require('../../src/sockets/duelHandler.js');
    });
    expect(fs.mkdirSync).toHaveBeenCalled();
  });

  describe('start_duel', () => {
    it('should silently return if exercise is not found', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue(null);
      setupDuelHandler(mockSocket as Socket);
      
      await socketEvents['start_duel']({ studentCode: 'code', exerciseId: 1 });
      expect(spawn).not.toHaveBeenCalled();
    });

    it('should emit error and finish if code building fails', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, teacherCodeMars: 'teacher' });
      (buildExecutionCodes as jest.Mock).mockImplementation(() => { throw new Error('Build Fail'); });
      setupDuelHandler(mockSocket as Socket);
      
      await socketEvents['start_duel']({ studentCode: 'code', exerciseId: 1 });
      expect(mockSocket.emit).toHaveBeenCalledWith('duel_student_output', expect.stringContaining('Build Fail'));
      expect(mockSocket.emit).toHaveBeenCalledWith('duel_student_finished');
    });

    it('should spawn two processes and pipe outputs correctly', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, teacherCodeMars: 'teacher' });
      (buildExecutionCodes as jest.Mock).mockReturnValue({ finalStudentCode: 'student', finalTeacherCode: 'teacher' });
      
      setupDuelHandler(mockSocket as Socket);
      await socketEvents['start_duel']({ studentCode: 'code', exerciseId: 1 });

      const studentStdoutCb = mockStudentProcess.stdout.on.mock.calls.find((c: any[]) => c[0] === 'data')[1];
      const studentStderrCb = mockStudentProcess.stderr.on.mock.calls.find((c: any[]) => c[0] === 'data')[1];
      studentStdoutCb(Buffer.from('s-out'));
      studentStderrCb(Buffer.from('s-err'));

      expect(mockSocket.emit).toHaveBeenCalledWith('duel_student_output', 's-out');
      expect(mockSocket.emit).toHaveBeenCalledWith('duel_student_output', expect.stringContaining('s-err'));

      const teacherStdoutCb = mockTeacherProcess.stdout.on.mock.calls.find((c: any[]) => c[0] === 'data')[1];
      const teacherStderrCb = mockTeacherProcess.stderr.on.mock.calls.find((c: any[]) => c[0] === 'data')[1];
      teacherStdoutCb(Buffer.from('t-out'));
      teacherStderrCb(Buffer.from('t-err'));

      expect(mockSocket.emit).toHaveBeenCalledWith('duel_teacher_output', 't-out');
      expect(mockSocket.emit).toHaveBeenCalledWith('duel_teacher_output', expect.stringContaining('t-err'));

      const studentCloseCb = mockStudentProcess.on.mock.calls.find((call: any[]) => call[0] === 'close')[1];
      const teacherCloseCb = mockTeacherProcess.on.mock.calls.find((call: any[]) => call[0] === 'close')[1];
      
      await studentCloseCb();
      await teacherCloseCb();

      expect(mockSocket.emit).toHaveBeenCalledWith('duel_student_finished');
      expect(mockSocket.emit).toHaveBeenCalledWith('duel_teacher_finished');
    });
  });

  describe('duel_input, stop_duel, disconnect', () => {
    it('should write to both processes and echo to teacher output', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, teacherCodeMars: 'teacher' });
      (buildExecutionCodes as jest.Mock).mockReturnValue({ finalStudentCode: 's', finalTeacherCode: 't' });
      
      setupDuelHandler(mockSocket as Socket);
      await socketEvents['start_duel']({ studentCode: 'code', exerciseId: 1 });
      
      socketEvents['duel_input']('data');
      expect(mockStudentProcess.stdin.write).toHaveBeenCalledWith('data');
      expect(mockTeacherProcess.stdin.write).toHaveBeenCalledWith('data');
      expect(mockSocket.emit).toHaveBeenCalledWith('duel_teacher_output', expect.stringContaining('data'));
    });

    it('should kill processes on stop_duel and disconnect', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (buildExecutionCodes as jest.Mock).mockReturnValue({ finalStudentCode: 's', finalTeacherCode: 't' });
      
      setupDuelHandler(mockSocket as Socket);
      await socketEvents['start_duel']({ studentCode: 'c', exerciseId: 1 });
      
      socketEvents['stop_duel']();
      expect(mockStudentProcess.kill).toHaveBeenCalled();

      await socketEvents['disconnect']();
      expect(mockTeacherProcess.kill).toHaveBeenCalled();
    });

    it('should silently ignore actions if no active processes exist', async () => {
      setupDuelHandler(mockSocket as Socket);

      socketEvents['duel_input']('data');
      expect(mockStudentProcess.stdin.write).not.toHaveBeenCalled();

      socketEvents['stop_duel']();
      expect(mockStudentProcess.kill).not.toHaveBeenCalled();

      await socketEvents['disconnect']();
      expect(mockTeacherProcess.kill).not.toHaveBeenCalled();
    });
  });

  describe('run_single_test', () => {
    it('should emit error if test is not found', async () => {
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, tests: [] });
      setupDuelHandler(mockSocket as Socket);
      
      await socketEvents['run_single_test']({ studentCode: 'c', exerciseId: 1, testIndex: 0 });
      expect(mockSocket.emit).toHaveBeenCalledWith('single_test_result', expect.objectContaining({ passed: false }));
    });

    it('should handle undefined test inputs safely and evaluate output', async () => {
      const mockTest = { inputs: null, expected: 'out' };
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, tests: [mockTest] });
      (buildExecutionCodes as jest.Mock).mockReturnValue({ finalStudentCode: 's' });
      (evaluateMips as jest.Mock).mockResolvedValue({ output: 'out\r\n', error: '' });

      setupDuelHandler(mockSocket as Socket);
      await socketEvents['run_single_test']({ studentCode: 'c', exerciseId: 1, testIndex: 0 });

      expect(mockSocket.emit).toHaveBeenCalledWith('single_test_result', expect.objectContaining({
        passed: true,
        output: 'out\r\n'
      }));
    });
    
    it('should catch critical execution errors', async () => {
      const mockTest = { inputs: 'in', expected: 'out' };
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, tests: [mockTest] });
      (buildExecutionCodes as jest.Mock).mockReturnValue({ finalStudentCode: 's' });
      (evaluateMips as jest.Mock).mockRejectedValue(new Error('Fatal'));

      setupDuelHandler(mockSocket as Socket);
      await socketEvents['run_single_test']({ studentCode: 'c', exerciseId: 1, testIndex: 0 });

      expect(mockSocket.emit).toHaveBeenCalledWith('single_test_result', expect.objectContaining({ passed: false }));
    });
  });
});