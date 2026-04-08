import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db.js';
import { appError, catchAsync } from '../utils/AppError.js';
import type { RegisterData, LoginCredentials } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_local';
const REGISTRATION_SECRET = process.env.REGISTRATION_SECRET;

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