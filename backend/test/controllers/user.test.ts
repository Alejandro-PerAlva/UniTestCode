/**
 * @module UserControllerTests
 * @description Unit tests for user controllers covering CRUD operations and bulk user imports.
 */

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { getUsers, createUser, updateUser, deleteUser, importUsers } from '../../src/controllers/user.js';
import { prisma } from '../../src/services/db.js';
import { appError } from '../../src/utils/appError.js';
import { AuthRequest } from '../../src/middleware/auth.js';

jest.mock('bcrypt');
jest.mock('../../src/services/db', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

describe('User Controllers', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: 1, email: 'test@test.com' }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      
      await getUsers(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should create a user and return 201', async () => {
      mockReq.body = { email: 'test@test.com', password: 'pass' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1 });
      
      await createUser(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw 400 if email is registered', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error());
      
      await createUser(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('updateUser', () => {
    it('should update user without hashing password if not provided', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { email: 'new@test.com' };
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: 1 });
      
      await updateUser(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: { email: 'new@test.com' } }));
    });

    it('should hash password if provided', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { password: 'newpass' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: 1 });
      
      await updateUser(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ password: 'hashed' }) }));
    });
  });

  describe('deleteUser', () => {
    it('should throw 400 if user tries to delete themselves', async () => {
      const authReq = { ...mockReq, user: { id: 1 }, params: { id: '1' } } as unknown as AuthRequest;
      
      await deleteUser(authReq, mockRes as Response, mockNext as NextFunction);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(appError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should delete user and return success', async () => {
      const authReq = { ...mockReq, user: { id: 2 }, params: { id: '1' } } as unknown as AuthRequest;
      (prisma.user.delete as jest.Mock).mockResolvedValue({ id: 1 });
      
      await deleteUser(authReq, mockRes as Response, mockNext as NextFunction);
      
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('importUsers', () => {
    it('should import users skipping existing ones', async () => {
      mockReq.body = [{ email: 'new@test.com' }, { email: 'exist@test.com' }, {}];
      
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      
      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 2 });
      
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 3 });
      
      await importUsers(mockReq as Request, mockRes as Response, mockNext as NextFunction);
      
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ imported: 1, skipped: 1 });
    });
  });
});