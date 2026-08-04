import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);

export default router;
