/**
 * @module UserRoutesTests
 * @description Unit tests for user administration routes, ensuring RBAC protection is active.
 */

import request from 'supertest';
import express from 'express';
import userRoutes from '../../src/routes/user.js';
import * as userControllers from '../../src/controllers/user.js';
import { requireAuth, requireTeacher } from '../../src/middleware/auth.js';

// Mock middlewares to track their execution
jest.mock('../../src/middleware/auth.js', () => ({
  requireAuth: jest.fn((req, res, next) => next()),
  requireTeacher: jest.fn((req, res, next) => next())
}));

// Mock controllers
jest.mock('../../src/controllers/user.js', () => ({
  getUsers: jest.fn((req, res) => res.json([])),
  createUser: jest.fn((req, res) => res.status(201).json({})),
  importUsers: jest.fn((req, res) => res.json({})),
  updateUser: jest.fn((req, res) => res.json({})),
  deleteUser: jest.fn((req, res) => res.json({}))
}));

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  it('should use requireAuth and requireTeacher middlewares for all routes', async () => {
    await request(app).get('/users');
    expect(requireAuth).toHaveBeenCalled();
    expect(requireTeacher).toHaveBeenCalled();
  });

  it('should map GET / to getUsers', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(userControllers.getUsers).toHaveBeenCalled();
  });

  it('should map POST / to createUser', async () => {
    const res = await request(app).post('/users');
    expect(res.status).toBe(201);
    expect(userControllers.createUser).toHaveBeenCalled();
  });

  it('should map POST /import to importUsers', async () => {
    const res = await request(app).post('/users/import');
    expect(res.status).toBe(200);
    expect(userControllers.importUsers).toHaveBeenCalled();
  });

  it('should map PUT /:id to updateUser', async () => {
    const res = await request(app).put('/users/1');
    expect(res.status).toBe(200);
    expect(userControllers.updateUser).toHaveBeenCalled();
  });

  it('should map DELETE /:id to deleteUser', async () => {
    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(200);
    expect(userControllers.deleteUser).toHaveBeenCalled();
  });
});