/**
 * @module AuthMiddleware
 * Provides Express middlewares for JWT validation and role-based access control (RBAC).
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appError } from '../utils/appError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_local';

/**
 * Represents the decoded payload of the application's JSON Web Tokens.
 */
export interface JwtPayload {
  /** The unique identifier of the user in the database. */
  id: number;
  /** The registered email of the user. */
  email: string;
  /** The authorization role (e.g., 'student' or 'teacher'). */
  role: string;
}

/**
 * Extends the standard Express Request interface to include the strictly typed user payload.
 */
export interface AuthRequest extends Request {
  /** Populated by the requireAuth middleware if the JWT is valid. */
  user?: JwtPayload;
}

/**
 * Express middleware that intercepts requests to ensure a valid JWT is present in the Authorization header.
 * If valid, decodes the token and attaches the user payload to the request object.
 * @param req - The Express request object (augmented with AuthRequest).
 * @param _res - The Express response object (unused).
 * @param next - The Express next middleware function.
 * @throws {appError} 401 - If the token is missing, malformed, or expired.
 */
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

/**
 * Express middleware that enforces Role-Based Access Control (RBAC) specifically for teachers.
 * Must be chained AFTER the requireAuth middleware.
 * @param req - The Express request object containing the decoded user payload.
 * @param _res - The Express response object (unused).
 * @param next - The Express next middleware function.
 * @throws {appError} 403 - If the user does not possess the 'teacher' role.
 */
export const requireTeacher = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'teacher') {
    return next(new appError('Acceso denegado. Se requieren permisos de Profesor.', 403));
  }
  next();
};