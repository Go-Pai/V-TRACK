'use server';

import { prisma } from '@/lib/prisma';
import { MuscleCategory } from '@prisma/client';
import { auth } from '@/auth';

export async function getExercises() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [
          { userId: null }, // Global exercises
          ...(userId ? [{ userId }] : []), // User's custom exercises
        ],
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: exercises };
  } catch (error) {
    console.error("Gagal mengambil data latihan:", error);
    return { success: false, data: [] };
  }
}

export async function createExercise(data: { name: string; category: string; target?: string }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const newExercise = await prisma.exercise.create({
      data: {
        name: data.name,
        category: data.category as MuscleCategory,
        target: data.target || null,
        userId,
      },
    });
    return { success: true, data: newExercise };
  } catch (error) {
    console.error("Gagal menambah gerakan:", error);
    return { success: false };
  }
}

export async function deleteExercise(id: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.exercise.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus gerakan:", error);
    return { success: false };
  }
}