import express from 'express';
import {
  createSwapRequest,
  getSwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwap,
} from '../controllers/swapController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createSwapRequest);
router.get('/', auth, getSwapRequests);
router.put('/:id/accept', auth, acceptSwapRequest);
router.put('/:id/reject', auth, rejectSwapRequest);
router.put('/:id/cancel', auth, cancelSwapRequest);
router.put('/:id/complete', auth, completeSwap);

export default router;
