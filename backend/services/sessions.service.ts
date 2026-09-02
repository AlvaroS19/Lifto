import { prisma } from '../lib/prisma';

export async function listSessions(userId: string) {
  return prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    include: { routine: { select: { id: true, name: true } } },
  });
}

export async function getSessionById(userId: string, sessionId: string) {
  return prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      routine: { select: { id: true, name: true } },
      sets: {
        include: { routineExercise: { include: { exercise: true } } },
        orderBy: { setNumber: 'asc' },
      },
    },
  });
}

export async function createSession(userId: string, routineId: string, notes?: string) {
  const routine = await prisma.routine.findFirst({ where: { id: routineId, userId } });
  if (!routine) return null;

  return prisma.workoutSession.create({
    data: { userId, routineId, notes },
  });
}

export async function updateSessionNotes(userId: string, sessionId: string, notes: string) {
  const existing = await prisma.workoutSession.findFirst({ where: { id: sessionId, userId } });
  if (!existing) return null;

  return prisma.workoutSession.update({
    where: { id: sessionId },
    data: { notes },
  });
}

interface SetInput {
  routineExerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  isDropset?: boolean;
  isRestpause?: boolean;
}

export async function addSet(userId: string, sessionId: string, data: SetInput) {
  const session = await prisma.workoutSession.findFirst({ where: { id: sessionId, userId } });
  if (!session) return null;

  return prisma.sessionSet.create({
    data: {
      sessionId,
      routineExerciseId: data.routineExerciseId,
      setNumber: data.setNumber,
      reps: data.reps,
      weight: data.weight,
      isDropset: data.isDropset ?? false,
      isRestpause: data.isRestpause ?? false,
    },
  });
}
