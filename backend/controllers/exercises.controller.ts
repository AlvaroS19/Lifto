import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { listExercises, createExercise } from '../services/exercises.service';

export async function getExercises(_req: AuthRequest, res: Response) {
  const exercises = await listExercises();
  res.json({ exercises });
}

export async function postExercise(req: AuthRequest, res: Response) {
  const { name, muscleGroup, equipment } = req.body;

  if (!name || !muscleGroup) {
    return res.status(400).json({ error: 'name y muscleGroup son obligatorios' });
  }

  try {
    const exercise = await createExercise(req.userId!, { name, muscleGroup, equipment });
    res.status(201).json({ exercise });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}
