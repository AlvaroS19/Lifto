import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  getSessions,
  getSession,
  postSession,
  patchSession,
  postSet,
} from '../controllers/sessions.controller';

const router = Router();

router.use(requireAuth);
router.get('/', getSessions);
router.post('/', postSession);
router.get('/:id', getSession);
router.patch('/:id', patchSession);
router.post('/:id/sets', postSet);

export default router;
