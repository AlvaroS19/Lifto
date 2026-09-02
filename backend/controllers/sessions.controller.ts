import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  listSessions,
  getSessionById,
  createSession,
  updateSessionNotes,
  addSet,
} from '../services/sessions.service';

export async function getSessions(req: AuthRequest, res: Response) {
  const sessions = await listSessions(req.userId!);
  res.json({ sessions });
}

export async function getSession(req: AuthRequest, res: Response) {
  const session = await getSessionById(req.userId!, req.params.id);
  if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
  res.json({ session });
}

export async function postSession(req: AuthRequest, res: Response) {
  const { routineId, notes } = req.body;

  if (!routineId) {
    return res.status(400).json({ error: 'routineId es obligatorio' });
  }

  try {
    const session = await createSession(req.userId!, routineId, notes);
    if (!session) return res.status(404).json({ error: 'Rutina no encontrada' });
    res.status(201).json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function patchSession(req: AuthRequest, res: Response) {
  const { notes } = req.body;

  if (notes === undefined) {
    return res.status(400).json({ error: 'notes es obligatorio' });
  }

  try {
    const session = await updateSessionNotes(req.userId!, req.params.id, notes);
    if (!session) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function postSet(req: AuthRequest, res: Response) {
  const { routineExerciseId, setNumber, reps, weight, isDropset, isRestpause } = req.body;

  if (!routineExerciseId || !setNumber || reps == null || weight == null) {
    return res.status(400).json({
      error: 'routineExerciseId, setNumber, reps y weight son obligatorios',
    });
  }

  try {
    const set = await addSet(req.userId!, req.params.id, {
      routineExerciseId,
      setNumber,
      reps,
      weight,
      isDropset,
      isRestpause,
    });
    if (!set) return res.status(404).json({ error: 'Sesión no encontrada' });
    res.status(201).json({ set });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}
