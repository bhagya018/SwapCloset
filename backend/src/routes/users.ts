import express from 'express';
import { getUserById, updateUserProfile, getUserListings } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/:id', getUserById);
router.put('/profile', auth, updateUserProfile);
router.get('/:id/listings', getUserListings);

export default router;
