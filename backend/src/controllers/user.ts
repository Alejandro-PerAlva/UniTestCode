import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ role: 'desc' }, { email: 'asc' }]
    });
    // Ocultamos las contraseñas reales, devolvemos datos seguros
    const safeUsers = users.map(u => ({ id: u.id, email: u.email, role: u.role }));
    res.json(safeUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        role: role || 'student' 
      }
    });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error: any) {
    res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { email, role, password } = req.body;
    
    // Preparamos los datos a actualizar
    let dataToUpdate: any = { email, role };
    
    // Solo actualizamos la contraseña si el profesor ha escrito una nueva
    if (password && password.trim() !== "") {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate
    });
    
    res.json({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (req.user?.id === Number(id)) {
      return res.status(400).json({ error: 'No puedes borrar tu propia cuenta.' });
    }
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const importUsers = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};