import { Router } from 'express';
import { 
  sendMessage, 
  getInbox, 
  getSent, 
  markAsRead, 
  deleteMessage,
  getUnreadCount 
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/sent', getSent);
router.get('/unread', getUnreadCount);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

export default router;
