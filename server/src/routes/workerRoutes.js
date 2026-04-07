import { Router } from 'express';
import { 
  getAllWorkers, 
  getWorkerById, 
  createWorkerProfile, 
  updateWorkerProfile, 
  deleteWorkerProfile,
  getCategories,
  getLocations
} from '../controllers/workerController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllWorkers);
router.get('/categories', getCategories);
router.get('/locations', getLocations);
router.get('/:id', getWorkerById);

router.post('/', authenticate, createWorkerProfile);
router.put('/:id', authenticate, updateWorkerProfile);
router.delete('/:id', authenticate, deleteWorkerProfile);

export default router;
