import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'supersecretdefaultkey';
const JWT_SECRET = Buffer.from(JWT_SECRET_STRING, 'utf8');

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'client' | 'owner';
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */ 

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado. Por favor, inicie sesión de nuevo.' });
      }
      return res.status(403).json({ message: 'Token inválido o acceso denegado.' });
    }

    req.user = user;
    next();
  });
};


export const authorizeRoles = (...allowedRoles: ('client' | 'owner')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied. Unspecified role.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. You do not have permission to access' });
    }
    next();
  };
};


