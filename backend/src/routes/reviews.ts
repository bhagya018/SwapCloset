import express from 'express';
import { createReview, getUserReviews, getSwapReviews } from '../controllers/reviewController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createReview);
router.get('/user/:id', getUserReviews);
router.get('/swap/:id', getSwapReviews);

export default router;
