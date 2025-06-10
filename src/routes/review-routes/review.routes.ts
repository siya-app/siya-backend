import { Router } from 'express';
import { getReviews, postReview, deleteReview } from '../../controllers/review-controllers/review.controller.js';

const router = Router();

router.get('/reviews', getReviews);
router.post('/reviews', postReview);
router.delete('/reviews/:id', deleteReview);

export default router;
