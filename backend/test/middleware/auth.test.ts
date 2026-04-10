/**
 * @module AuthMiddlewareTests
 * @description Unit tests for JWT validation and role-based access control middlewares.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { requireAuth, requireTeacher, AuthRequest } from '../../src/middleware/auth.js';
import { appError } from '../../src/utils/appError.js';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('should throw 401 if authorization header is missing', () => {
      requireAuth(mockReq as AuthRequest, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should throw 401 if authorization header does not start with Bearer', () => {
      mockReq.headers = { authorization: 'Basic token' };
      requireAuth(mockReq as AuthRequest, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should throw 401 if token is invalid', () => {
      mockReq.headers = { authorization: 'Bearer invalid_token' };
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid'); });
      requireAuth(mockReq as AuthRequest, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
    });

    it('should attach user to request and call next on success', () => {
      mockReq.headers = { authorization: 'Bearer valid_token' };
      const mockPayload = { id: 1, email: 'test@test.com', role: 'student' };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
      
      requireAuth(mockReq as AuthRequest, mockRes as Response, mockNext as NextFunction);
      
      expect(jwt.verify).toHaveBeenCalledWith('valid_token', expect.any(String));
      expect(mockReq.user).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('requireTeacher', () => {
    it('should throw 403 if user is not attached to request', () => {
      requireTeacher(mockReq as AuthRequest, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(403);
    });

    it('should throw 403 if user role is not teacher', () => {
      mockReq.user = { id: 1, email: 'test@test.com', role: 'student' };
      requireTeacher(mockReq as AuthRequest, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(403);
    });

    it('should call next if user role is teacher', () => {
      mockReq.user = { id: 1, email: 'test@test.com', role: 'teacher' };
      requireTeacher(mockReq as AuthRequest, mockRes as Response, mockNext as NextFunction);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});