import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getBodyWeightLogs, postBodyWeightLog } from '../controllers/bodyweight.controller';

const router = Router();

router.use(requireAuth);
router.get('/', getBodyWeightLogs);
router.post('/', postBodyWeightLog);

export default router;
