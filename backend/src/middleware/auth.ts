import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_123';

// Extenderemos la interfaz Request de Express para que acepte a nuestro 'user'
export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): any => {
  // El token suele venir en la cabecera: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en la petición
    next(); // Le dejamos pasar a la ruta que quería ir
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado. Vuelve a iniciar sesión.' });
  }
};

export const requireTeacher = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Profesor.' });
  }
  next();
};