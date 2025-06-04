import { Router } from 'express';
import { createUser } from '../../controllers/user-controllers/user.controller.js';
import { createNewTerrace } from '../../controllers/terrace-controllers/terrace.controller.js';

const router = Router();

router.post('/users', createUser);
router.post('/terraces', createNewTerrace)

export default router;
