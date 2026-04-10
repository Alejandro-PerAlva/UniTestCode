/**
 * @module ExerciseControllerTests
 * @description Unit tests for exercise controllers managing CRUD operations, code evaluations, and bulk imports.
 */

import { Request, Response, NextFunction } from 'express';
import { getExercises, createExercise, updateExercise, deleteExercise, evaluateExercise, createTestCase, deleteTestCase, importExercises } from '../../src/controllers/exercise.js';
import { prisma } from '../../src/services/db.js';
import { buildExecutionCodes, evaluateMips } from '../../src/services/evaluator.js';
import { normalizeSpimToMars } from '../../src/services/parser.js';

jest.mock('../../src/services/db', () => ({
  prisma: {
    exercise: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn() },
    testCase: { create: jest.fn(), delete: jest.fn() }
  }
}));
jest.mock('../../src/services/evaluator');
jest.mock('../../src/services/parser');

describe('Exercise Controllers', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { body: {}, params: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getExercises', () => {
    it('should return all exercises', async () => {
      (prisma.exercise.findMany as jest.Mock).mockResolvedValue([]);
      await getExercises(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe('createExercise', () => {
    it('should normalize code if language is mips', async () => {
      mockReq.body = { title: 'T', language: 'mips', teacherCode: 'code' };
      (normalizeSpimToMars as jest.Mock).mockReturnValue('marsCode');
      (prisma.exercise.create as jest.Mock).mockResolvedValue({ id: 1 });
      await createExercise(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(normalizeSpimToMars).toHaveBeenCalledWith('code');
      expect(prisma.exercise.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ teacherCodeMars: 'marsCode' }) }));
    });

    it('should not normalize if language is not mips', async () => {
      mockReq.body = { title: 'T', language: 'java', teacherCode: 'code' };
      (prisma.exercise.create as jest.Mock).mockResolvedValue({ id: 1 });
      await createExercise(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(normalizeSpimToMars).not.toHaveBeenCalled();
    });
  });

  describe('updateExercise', () => {
    it('should update teacherCodeMars if teacherCode is updated and language is mips', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { teacherCode: 'newCode', language: 'mips' };
      (normalizeSpimToMars as jest.Mock).mockReturnValue('newMarsCode');
      (prisma.exercise.update as jest.Mock).mockResolvedValue({ id: 1 });
      await updateExercise(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(normalizeSpimToMars).toHaveBeenCalledWith('newCode');
    });
  });

  describe('deleteExercise', () => {
    it('should delete exercise by id', async () => {
      mockReq.params = { id: '1' };
      await deleteExercise(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(prisma.exercise.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('evaluateExercise', () => {
    it('should throw 404 if exercise not found', async () => {
      mockReq.params = { id: '1' };
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue(null);
      await evaluateExercise(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });

    it('should throw 400 if buildExecutionCodes fails', async () => {
      mockReq.params = { id: '1' };
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, tests: [] });
      (buildExecutionCodes as jest.Mock).mockImplementation(() => { throw new Error('Build error'); });
      await evaluateExercise(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should evaluate tests and return success flag', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { studentCode: 'code', targetFunction: 'main' };
      const mockTests = [{ id: 1, inputs: '1\n2', expected: '3' }];
      (prisma.exercise.findUnique as jest.Mock).mockResolvedValue({ id: 1, teacherCodeMars: 'tc', tests: mockTests });
      (buildExecutionCodes as jest.Mock).mockReturnValue({ finalStudentCode: 'finalCode' });
      (evaluateMips as jest.Mock).mockResolvedValue({ output: '3', error: '', timeout: false });

      await evaluateExercise(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        allPassed: true,
        results: expect.arrayContaining([expect.objectContaining({ passed: true })])
      }));
    });
  });

  describe('createTestCase', () => {
    it('should create a test case', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { inputs: 'a', expected: 'b' };
      await createTestCase(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(prisma.testCase.create).toHaveBeenCalled();
    });
  });

  describe('deleteTestCase', () => {
    it('should delete a test case', async () => {
      mockReq.params = { testId: '1' };
      await deleteTestCase(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(prisma.testCase.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('importExercises', () => {
    it('should import exercises and skip duplicates, handling missing test properties', async () => {
      // Evaluates explicit/fallback languages, visibility, and malformed test payloads
      mockReq.body = [
        { 
          title: 'Ex1', 
          language: 'java', 
          isVisible: false, 
          tests: [
            { inputs: 'in', expected: 'out' },
            { inputs: 'in_only' },       // Missing expected
            { expected: 'out_only' },    // Missing inputs
            {}                           // Missing both
          ] 
        }, 
        { title: 'Ex2', isVisible: null }
      ];
      
      (prisma.exercise.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce(null);
      
      await importExercises(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(prisma.exercise.create).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, imported: 1, skipped: 1 });
    });
  });
});