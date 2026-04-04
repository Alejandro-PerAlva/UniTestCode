import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db.js';

// En producción esto debería estar en tu archivo .env
const JWT_SECRET = process.env.JWT_SECRET;
const REGISTRATION_SECRET = process.env.REGISTRATION_SECRET;

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role, secretCode } = req.body;

    // EL CANDADO: Verificamos el código secreto
    if (secretCode !== REGISTRATION_SECRET) {
      return res.status(403).json({ error: 'Código de invitación inválido.' });
    }

    // Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        role: role || 'student' 
      }
    });

    res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(400).json({ error: 'Error al registrar usuario. ¿Quizás el email ya existe?' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // 1. Buscamos al usuario por su email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    // 2. Comparamos la contraseña enviada con la encriptada en la base de datos
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    // 3. Generamos el Token JWT que caduca en 1 hora
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};