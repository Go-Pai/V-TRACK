'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createWorkoutSession(data: {
  name: string;
  startTime?: Date | null;
  exercises: any[];
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "Unauthorized. Please sign in first." };
    }

    // Filter hanya set yang sudah DICENTANG dan ADA ANGKANYA
    const validSets = data.exercises.flatMap((ex: any) =>
      ex.sets
        .filter((set: any) => set.isCompleted && set.weight && set.reps)
        .map((set: any) => ({
          exerciseId: ex.exerciseId,
          weight: parseFloat(set.weight),
          reps: parseInt(set.reps),
          rpe: set.rpe ? parseInt(set.rpe) : null,
        }))
    );

    if (validSets.length === 0) {
      return { success: false, error: "Centang minimal 1 set dulu sebelum mengakhiri latihan!" };
    }

    const newSession = await prisma.workoutSession.create({
      data: {
        userId,
        name: data.name || 'Sesi Latihan',
        startTime: data.startTime ? new Date(data.startTime) : new Date(),
        endTime: new Date(),
        sets: {
          create: validSets,
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/history");

    return { success: true, data: newSession };
  } catch (error: any) {
    console.error("Gagal buat sesi:", error);
    return { success: false, error: error.message || "Gagal menyimpan ke database" };
  }
}