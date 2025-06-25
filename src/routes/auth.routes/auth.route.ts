// routes/auth-routes/auth.routes.ts
import { Router } from 'express';
import { loginUser, verifyPassword } from '../../controllers/auth-controller/auth.controller.js';
import { isTokenValid } from '../../middleware/auth.middleware.js';

const router = Router();

// Ruta para login
router.post('/auth/login', loginUser);
router.post("/auth/verify-password", isTokenValid, verifyPassword);

export default router;
