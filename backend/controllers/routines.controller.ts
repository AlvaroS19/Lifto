import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  listRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from '../services/routines.service';

export async function getRoutines(req: AuthRequest, res: Response) {
  const routines = await listRoutines(req.userId!);
  res.json({ routines });
}

export async function getRoutine(req: AuthRequest, res: Response) {
  const routine = await getRoutineById(req.userId!, req.params.id);
  if (!routine) return res.status(404).json({ error: 'Rutina no encontrada' });
  res.json({ routine });
}

export async function postRoutine(req: AuthRequest, res: Response) {
  const { name, exercises } = req.body;

  if (!name || !Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({
      error: 'name y una lista de exercises (al menos uno) son obligatorios',
    });
  }

  try {
    const routine = await createRoutine(req.userId!, name, exercises);
    res.status(201).json({ routine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function patchRoutine(req: AuthRequest, res: Response) {
  const { name, exercises } = req.body;

  try {
    const routine = await updateRoutine(req.userId!, req.params.id, name, exercises);
    if (!routine) return res.status(404).json({ error: 'Rutina no encontrada' });
    res.json({ routine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}

export async function removeRoutine(req: AuthRequest, res: Response) {
  const deleted = await deleteRoutine(req.userId!, req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Rutina no encontrada' });
  res.status(204).send();
}
