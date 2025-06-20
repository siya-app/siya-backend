import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../../controllers/favorite-controller/favorite.controller.js';

const router = Router();

router.post('/favorites', addFavorite);
router.get('/favorites', getFavorites);
router.delete('/favorites', removeFavorite);

export default router;
