import express from 'express';
import {
  getStats,
  getAllUsers,
  suspendUser,
  getAllListings,
  removeListing,
  getAllSwaps,
} from '../controllers/adminController';
import { auth, admin } from '../middleware/auth';

const router = express.Router();

router.get('/stats', auth, admin, getStats);
router.get('/users', auth, admin, getAllUsers);
router.put('/users/:id/suspend', auth, admin, suspendUser);
router.get('/listings', auth, admin, getAllListings);
router.delete('/listings/:id', auth, admin, removeListing);
router.get('/swaps', auth, admin, getAllSwaps);

export default router;
