import { prisma } from '../lib/prisma';

export async function listBodyWeightLogs(userId: string) {
  return prisma.bodyWeightLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

export async function createBodyWeightLog(userId: string, weight: number, date?: string) {
  return prisma.bodyWeightLog.create({
    data: {
      userId,
      weight,
      date: date ? new Date(date) : undefined,
    },
  });
}
