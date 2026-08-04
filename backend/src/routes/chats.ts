import express from 'express';
import { getChats, getChatById, sendMessage, markMessagesAsRead } from '../controllers/chatController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getChats);
router.get('/:id', auth, getChatById);
router.post('/:id/messages', auth, sendMessage);
router.put('/:id/read', auth, markMessagesAsRead);

export default router;
