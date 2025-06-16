// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET_STRING = process.env.JWT_SECRET || 'supersecretdefaultkey';
// const JWT_SECRET = Buffer.from(JWT_SECRET_STRING, 'utf8');

// /* eslint-disable @typescript-eslint/no-namespace */
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         role: 'client' | 'owner';
//       };
//     }
//   }
// }
// /* eslint-enable @typescript-eslint/no-namespace */ 

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) {
//     return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
//   }

  
//   jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
//     if (err) {
//       if (err.name === 'TokenExpiredError') {
//         return res.status(401).json({ message: 'Token expirado. Por favor, inicie sesión de nuevo.' });
//       }
//       return res.status(403).json({ message: 'Token inválido o acceso denegado.' });
//     }

//     req.user = user;
//     next();
//   });
// };


// export const authorizeRoles = (...allowedRoles: ('client' | 'owner')[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || !req.user.role) {
//       return res.status(403).json({ message: 'Access denied. Unspecified role.' });
//     }
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied. You do not have permission to access' });
//     }
//     next();
//   };
// };
//-------------------------------------------------------------------------------------------------------------

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Asegúrate de que JWT_SECRET se carga correctamente desde tus variables de entorno
// Se recomienda usar un archivo .env y dotenv para gestionar esto
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretdefaultkey';

// Extender la interfaz Request de Express para añadir la propiedad 'user'
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // El ID de tu usuario desde el token JWT
    email: string;
    role: string;
    // Agrega cualquier otra propiedad que almacenes en el payload del token
  };
}

/**
 * Middleware para verificar la validez de un token JWT.
 * Adjunta la información del usuario decodificada a `req.user`.
 */
export const isTokenValid = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Falta o el encabezado de autorización es inválido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica y decodifica el token usando el secreto JWT
    // El 'as any' es un workaround si no tienes un tipo JWT.
    // Lo ideal es tener una interfaz para el payload del JWT.
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedRequest['user'];
    
    // Adjunta la información decodificada del usuario al objeto request
    req.user = decoded; // TypeScript ahora lo reconoce gracias a AuthenticatedRequest
    
    next(); // Continúa al siguiente middleware o controlador
  } catch (err) {
    console.error('❌ Token inválido o expirado:', err);
    // Manejo de errores específico para JWT
    if (err instanceof jwt.JsonWebTokenError) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado. Por favor, inicie sesión de nuevo.' });
      }
      return res.status(401).json({ error: 'Token inválido. Acceso denegado.' });
    }
    return res.status(500).json({ error: 'Error del servidor al validar el token.' });
  }
};