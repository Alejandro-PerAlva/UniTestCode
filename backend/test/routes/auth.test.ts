/**
 * @module AuthRoutesTests
 * @description Unit tests for authentication routing, ensuring endpoints are correctly mapped to controllers.
 */

import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth.js';
import * as authControllers from '../../src/controllers/auth.js';

// Mock the controllers to avoid executing real business logic
jest.mock('../../src/controllers/auth.js', () => ({
  register: jest.fn((req, res) => res.status(201).json({ success: true })),
  login: jest.fn((req, res) => res.status(200).json({ token: 'test-token' }))
}));

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  it('should map POST /register to the register controller', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'test@test.com' });
    expect(res.status).toBe(201);
    expect(authControllers.register).toHaveBeenCalled();
  });

  it('should map POST /login to the login controller', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'test@test.com' });
    expect(res.status).toBe(200);
    expect(authControllers.login).toHaveBeenCalled();
  });
});