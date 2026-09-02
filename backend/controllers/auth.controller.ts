import { Request, Response } from 'express';
import { registerUser, loginUser, AuthError } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password || password.length < 8) {
    return res.status(400).json({
      error: 'email y password (mínimo 8 caracteres) son obligatorios',
    });
  }

  try {
    const user = await registerUser(email, password);
    return res.status(201).json({ user });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son obligatorios' });
  }

  try {
    const { token, user } = await loginUser(email, password);
    return res.json({ token, user });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
