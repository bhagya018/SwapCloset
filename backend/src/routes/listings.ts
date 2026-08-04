import express from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getNearbyListings,
  getSimilarListings,
} from '../controllers/listingController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createListing);
router.get('/', getListings);
router.get('/nearby', auth, getNearbyListings);
router.get('/similar/:id', getSimilarListings);
router.get('/:id', getListingById);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

export default router;
