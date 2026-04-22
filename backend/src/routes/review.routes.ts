import { Router } from 'express';
import { createReview, getProductReviews, getUserReviews } from '../controllers/review.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, createReview);
router.get('/product/:id', getProductReviews);
router.get('/user/:id', getUserReviews);

export default router;
