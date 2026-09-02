import { prisma } from '../lib/prisma';

export async function listExercises() {
  return prisma.exercise.findMany({ orderBy: { name: 'asc' } });
}

export async function createExercise(
  userId: string,
  data: { name: string; muscleGroup: string; equipment?: string }
) {
  return prisma.exercise.create({
    data: {
      name: data.name,
      muscleGroup: data.muscleGroup,
      equipment: data.equipment,
      createdById: userId,
    },
  });
}
