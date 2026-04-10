/**
 * @module AuthControllerTests
 * @description Unit tests for authentication controllers including user registration and login workflows.
 */

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login } from '../../src/controllers/auth.js';
import { prisma } from '../../src/services/db.js';
import { appError } from '../../src/utils/appError.js';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/services/db', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

describe('Auth Controllers', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw 403 if secret code is invalid', async () => {
      mockReq.body = { secretCode: 'wrong' };
      await register(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(403);
    });

    it('should create a user and return 201 on success', async () => {
      mockReq.body = { email: 'test@test.com', password: 'pass', role: 'student', secretCode: undefined };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com', role: 'student' });

      await register(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, user: expect.any(Object) });
    });

    it('should throw 400 if database creation fails', async () => {
      mockReq.body = { secretCode: undefined };
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error());
      await register(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('login', () => {
    it('should throw 401 if user is not found', async () => {
      mockReq.body = { email: 'test@test.com', password: 'pass' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await login(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should throw 401 if password does not match', async () => {
      mockReq.body = { email: 'test@test.com', password: 'wrong' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await login(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should return token and user data on success', async () => {
      mockReq.body = { email: 'test@test.com', password: 'pass' };
      const mockUser = { id: 1, email: 'test@test.com', role: 'student', password: 'hashed' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await login(mockReq as Request, mockRes as Response, mockNext as NextFunction);

      expect(jwt.sign).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ token: 'mockToken', user: { id: 1, email: 'test@test.com', role: 'student' } });
    });
  });
});