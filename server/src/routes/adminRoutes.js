import { Router } from 'express';
import { 
  getDashboardStats,
  getAllWorkersAdmin,
  getAllClients,
  verifyWorker,
  unverifyWorker,
  suspendWorker,
  activateWorker,
  getAllReviewsAdmin,
  deleteReviewAdmin
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/workers', getAllWorkersAdmin);
router.get('/clients', getAllClients);
router.get('/reviews', getAllReviewsAdmin);

router.put('/workers/:id/verify', verifyWorker);
router.put('/workers/:id/unverify', unverifyWorker);
router.put('/workers/:id/suspend', suspendWorker);
router.put('/workers/:id/activate', activateWorker);

router.delete('/reviews/:id', deleteReviewAdmin);

export default router;
