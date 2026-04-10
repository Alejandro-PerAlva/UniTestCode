/**
 * @module AuthControllers
 * Provides handler functions for user authentication, including registration and login.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db.js';
import { appError, catchAsync } from '../utils/appError.js';
import type { RegisterData, LoginCredentials } from '../types/index.js';

/**
 * Secret key used to sign the JSON Web Tokens.
 * Falls back to a local secret if the environment variable is not set.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_local';

/**
 * Secret code required to register a new account on the platform.
 */
const REGISTRATION_SECRET = process.env.REGISTRATION_SECRET;

/**
 * Registers a new user in the system.
 * * Validates the provided registration secret code before hashing the user's password
 * and storing the new user record in the database.
 * @param req - The Express request object containing the {@link RegisterData} in the body.
 * @param res - The Express response object used to send the created user data.
 * @throws {appError} 403 - If the provided secret code does not match the environment's registration secret.
 * @throws {appError} 400 - If the database creation fails, typically due to a duplicate email.
 * @returns A JSON response containing a success flag and the newly created user object.
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, role, secretCode }: RegisterData = req.body;

  if (secretCode !== REGISTRATION_SECRET) {
    throw new appError('Código de invitación inválido.', 403);
  }

  const hashedPassword = await bcrypt.hash(password || '', 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: role || 'student' },
      select: { id: true, email: true, role: true }
    });
    res.status(201).json({ success: true, user });
  } catch (err) {
    throw new appError('Error al registrar usuario. ¿Quizás el email ya existe?', 400);
  }
});

/**
 * Authenticates an existing user and generates an access token.
 * * Looks up the user by email, verifies the hashed password, and issues a JSON Web Token (JWT)
 * valid for 7 days if the credentials are correct.
 * @param req - The Express request object containing the {@link LoginCredentials} in the body.
 * @param res - The Express response object used to send the JWT and user data.
 * @throws {appError} 401 - If the user is not found or the provided password does not match.
 * @returns A JSON response containing the generated JWT and the authenticated user's data.
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password }: LoginCredentials = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    throw new appError('Credenciales inválidas', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});