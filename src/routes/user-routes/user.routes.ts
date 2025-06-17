import { Router } from 'express';
import { createUser, getAllUsers, getUserByEmailOrId, updateUser, deleteUser } from '../../controllers/user-controllers/user.controller.js';
import { isTokenValid } from '../../middleware/auth.middleware.js'; // ✅ Importación corregida para el middleware
import { loginUser } from '../../controllers/auth-controller/auth.controller.js';


const router = Router();
router.post('/login', loginUser);

router.post('/users', createUser);
router.get('/users', getAllUsers); // Do we need this route?????
router.get('/users/:id', isTokenValid, getUserByEmailOrId);


router.put('/users/:id', isTokenValid, updateUser);


router.delete('/users/:id', isTokenValid, deleteUser);

export default router;