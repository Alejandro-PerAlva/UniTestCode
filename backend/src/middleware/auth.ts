import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appError } from '../utils/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_local';

// Definimos la estructura exacta de lo que guardamos en el Token
export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

// Extendemos Request de forma estricta, sin 'any'
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new appError('Acceso denegado. Token no proporcionado o formato inválido.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; 
    next(); 
  } catch (error) {
    next(new appError('Token inválido o expirado. Vuelve a iniciar sesión.', 401));
  }
};

export const requireTeacher = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'teacher') {
    return next(new appError('Acceso denegado. Se requieren permisos de Profesor.', 403));
  }
  next();
};