import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { listBodyWeightLogs, createBodyWeightLog } from '../services/bodyweight.service';

export async function getBodyWeightLogs(req: AuthRequest, res: Response) {
  const logs = await listBodyWeightLogs(req.userId!);
  res.json({ logs });
}

export async function postBodyWeightLog(req: AuthRequest, res: Response) {
  const { weight, date } = req.body;

  if (weight == null) {
    return res.status(400).json({ error: 'weight es obligatorio' });
  }

  try {
    const log = await createBodyWeightLog(req.userId!, weight, date);
    res.status(201).json({ log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
}
