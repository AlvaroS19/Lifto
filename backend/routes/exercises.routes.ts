import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getExercises, postExercise } from '../controllers/exercises.controller';

const router = Router();

router.use(requireAuth);
router.get('/', getExercises);
router.post('/', postExercise);

export default router;
