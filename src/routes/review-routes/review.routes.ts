import { Router } from 'express';
import { getReviews, postReview, deleteReview, getReviewsFromUser } from '../../controllers/review-controllers/review.controller.js';

const router = Router();

router.get('/', getReviews);
router.get('/from-user', getReviewsFromUser);
router.post('/', postReview);
router.delete('/:id', deleteReview);
console.log('Review routes initialized');

export default router;