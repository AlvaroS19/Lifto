import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  getRoutines,
  getRoutine,
  postRoutine,
  patchRoutine,
  removeRoutine,
} from '../controllers/routines.controller';

const router = Router();

router.use(requireAuth);
router.get('/', getRoutines);
router.post('/', postRoutine);
router.get('/:id', getRoutine);
router.patch('/:id', patchRoutine);
router.delete('/:id', removeRoutine);

export default router;
