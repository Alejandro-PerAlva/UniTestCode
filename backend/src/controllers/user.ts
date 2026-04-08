import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { appError, catchAsync } from '../utils/AppError.js';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: [{ role: 'desc' }, { email: 'asc' }],
    select: { id: true, email: true, role: true }
  });
  res.json(users);
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        role: role || 'student' 
      },
      select: { id: true, email: true, role: true }
    });
    res.status(201).json(user);
  } catch (err) {
    throw new appError('El correo electrónico ya está registrado.', 400);
  }
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, role, password } = req.body;
  
  const dataToUpdate: any = { email, role };
  
  if (password && password.trim() !== "") {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: dataToUpdate,
    select: { id: true, email: true, role: true }
  });
  
  res.json(updatedUser);
});

export const deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (req.user?.id === Number(id)) {
    throw new appError('No puedes borrar tu propia cuenta.', 400);
  }
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

export const importUsers = catchAsync(async (req: Request, res: Response) => {
  const users = req.body;
  let imported = 0;
  let skipped = 0;
  const defaultPassword = await bcrypt.hash('123456', 10);

  for (const u of users) {
    if (!u.email) continue; 
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.user.create({
      data: { email: u.email, password: defaultPassword, role: u.role || 'student' }
    });
    imported++;
  }
  res.json({ imported, skipped });
});