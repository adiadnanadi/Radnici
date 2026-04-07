import { Router } from 'express';
import { 
  getFavorites, 
  addFavorite, 
  removeFavorite, 
  checkFavorite 
} from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getFavorites);
router.post('/:workerId', addFavorite);
router.delete('/:workerId', removeFavorite);
router.get('/:workerId/check', checkFavorite);

export default router;
