import { Router } from 'express';
import { createUser, getAllUsers, getUserByEmailOrId, updateUser, deleteUser } from '../../controllers/user-controllers/user.controller.js';
import { authenticateToken, authorizeRoles } from '../../middleware/auth.middleware.js';
import { loginUser } from '../../controllers/auth-controller/auth.controller.js';


const router = Router();
router.post('/login', loginUser);

router.post('/users', createUser);
router.get('/users', authenticateToken, getAllUsers); // Do we need this route?????
router.get('/users/:id', authenticateToken, getUserByEmailOrId);


router.put('/users/:id', authenticateToken, updateUser); 


router.delete('/users/:id', authenticateToken, deleteUser); 

export default router;
