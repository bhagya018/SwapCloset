import express from 'express';
import { addToFavorites, removeFromFavorites, getFavorites } from '../controllers/favoriteController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, addToFavorites);
router.delete('/:listingId', auth, removeFromFavorites);
router.get('/', auth, getFavorites);

export default router;
