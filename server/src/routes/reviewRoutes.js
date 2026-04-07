import { Router } from 'express';
import { 
  createReview, 
  getWorkerReviews, 
  deleteReview 
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/worker/:workerId', getWorkerReviews);
router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
