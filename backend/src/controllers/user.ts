/**
 * @module UserControllers
 * Handles administrative CRUD operations and bulk imports for user accounts.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { appError, catchAsync } from '../utils/appError.js';

/**
 * Retrieves a sanitized list of all users registered in the platform.
 * Sorted primarily by role (teachers first) and secondarily by email.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A JSON array of user objects (excluding password hashes).
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: [{ role: 'desc' }, { email: 'asc' }],
    select: { id: true, email: true, role: true }
  });
  res.json(users);
});

/**
 * Manually creates a new user account.
 * Primarily used by administrators to bypass the self-registration process.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @throws {appError} 400 - If the provided email is already registered.
 * @returns A JSON representation of the created user (excluding password hash).
 */
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

/**
 * Updates an existing user's details, including role elevations or password resets.
 * @param req - The Express request object containing the target user ID.
 * @param res - The Express response object.
 * @returns A JSON representation of the updated user.
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, role, password } = req.body;
  
  const dataToUpdate: Record<string, any> = { email, role };
  
  // Only re-hash and update the password if a new one was explicitly provided
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

/**
 * Deletes a user account from the database.
 * Includes a safety mechanism preventing the currently authenticated administrator 
 * from deleting their own account.
 * @param req - The Express request object (extended with JWT auth payload).
 * @param res - The Express response object.
 * @throws {appError} 400 - If the requester attempts to delete their own ID.
 * @returns A JSON success flag.
 */
export const deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  if (req.user?.id === Number(id)) {
    throw new appError('No puedes borrar tu propia cuenta.', 400);
  }
  
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

/**
 * Bulk imports an array of users into the database.
 * Assigns a temporary default password to all imported users and skips existing emails.
 * @param req - The Express request object containing an array of user definitions.
 * @param res - The Express response object.
 * @returns A JSON payload indicating the number of successfully imported and skipped users.
 */
export const importUsers = catchAsync(async (req: Request, res: Response) => {
  const users = req.body;
  let imported = 0;
  let skipped = 0;
  
  // Temporary default password assigned to all bulk-imported accounts
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