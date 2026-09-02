import { prisma } from '../lib/prisma';

interface RoutineExerciseInput {
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  supersetGroupId?: string;
}

export async function listRoutines(userId: string) {
  return prisma.routine.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRoutineById(userId: string, routineId: string) {
  return prisma.routine.findFirst({
    where: { id: routineId, userId },
    include: {
      exercises: {
        include: { exercise: true },
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function createRoutine(
  userId: string,
  name: string,
  exercises: RoutineExerciseInput[]
) {
  return prisma.routine.create({
    data: {
      userId,
      name,
      exercises: {
        create: exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          order: ex.order,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps,
          targetWeight: ex.targetWeight,
          supersetGroupId: ex.supersetGroupId,
        })),
      },
    },
    include: { exercises: true },
  });
}

export async function updateRoutine(
  userId: string,
  routineId: string,
  name?: string,
  exercises?: RoutineExerciseInput[]
) {
  const existing = await prisma.routine.findFirst({ where: { id: routineId, userId } });
  if (!existing) return null;

  return prisma.$transaction(async (tx) => {
    if (exercises) {
      await tx.routineExercise.deleteMany({ where: { routineId } });
      await tx.routineExercise.createMany({
        data: exercises.map((ex) => ({
          routineId,
          exerciseId: ex.exerciseId,
          order: ex.order,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps,
          targetWeight: ex.targetWeight,
          supersetGroupId: ex.supersetGroupId,
        })),
      });
    }

    return tx.routine.update({
      where: { id: routineId },
      data: name ? { name } : {},
      include: { exercises: true },
    });
  });
}

export async function deleteRoutine(userId: string, routineId: string) {
  const existing = await prisma.routine.findFirst({ where: { id: routineId, userId } });
  if (!existing) return false;

  await prisma.routine.delete({ where: { id: routineId } });
  return true;
}
