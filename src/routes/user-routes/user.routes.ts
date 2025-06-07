import { Router } from 'express';
import { createUser, getAllUsers, getUserByEmailOrId, updateUser, deleteUser } from '../../controllers/user-controllers/user.controller.js';


const router = Router();
router.get('/users', getAllUsers);
router.get('/users/:id', getUserByEmailOrId);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
