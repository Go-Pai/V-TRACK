import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MuscleCategory } from '@prisma/client';

export async function GET() {
  try {
    const exercises = [
      // --- DADA ---
      { name: 'Bench Press (Barbell/Dumbbell)', target: 'Middle Chest (Keseluruhan dada)', category: MuscleCategory.DADA },
      { name: 'Incline Dumbbell Press', target: 'Upper Chest', category: MuscleCategory.DADA },
      { name: 'Decline Bench Press', target: 'Lower Chest', category: MuscleCategory.DADA },
      { name: 'Chest Dips', target: 'Lower Chest & Triceps', category: MuscleCategory.DADA },
      { name: 'Cable Flyes', target: 'Inner Chest (Pemisah otot dada)', category: MuscleCategory.DADA },

      // --- PUNGGUNG ---
      { name: 'Pull Ups', target: 'Latissimus Dorsi (Lebar punggung)', category: MuscleCategory.PUNGGUNG },
      { name: 'Bent Over Barbell Row', target: 'Mid-Back (Ketebalan punggung)', category: MuscleCategory.PUNGGUNG },
      { name: 'Lat Pulldown', target: 'Latissimus Dorsi', category: MuscleCategory.PUNGGUNG },
      { name: 'Seated Cable Row', target: 'Rhomboids & Middle Traps', category: MuscleCategory.PUNGGUNG },
      { name: 'Face Pulls', target: 'Rear Delts & Upper Back', category: MuscleCategory.PUNGGUNG },

      // --- BAHU ---
      { name: 'Overhead Press (Military Press)', target: 'Front & Side Delts', category: MuscleCategory.BAHU },
      { name: 'Dumbbell Lateral Raise', target: 'Side Delts (Lebar bahu)', category: MuscleCategory.BAHU },
      { name: 'Arnold Press', target: 'Front & Side Delts', category: MuscleCategory.BAHU },
      { name: 'Reverse Pec Deck Fly', target: 'Rear Delts', category: MuscleCategory.BAHU },
      { name: 'Upright Row', target: 'Side Delts & Traps', category: MuscleCategory.BAHU },

      // --- KAKI ---
      { name: 'Squats (Barbell/Goblet)', target: 'Quadriceps & Glutes', category: MuscleCategory.KAKI },
      { name: 'Romanian Deadlift', target: 'Hamstrings & Glutes', category: MuscleCategory.KAKI },
      { name: 'Leg Press', target: 'Quadriceps', category: MuscleCategory.KAKI },
      { name: 'Walking Lunges', target: 'Quadriceps, Hamstrings & Glutes', category: MuscleCategory.KAKI },
      { name: 'Calf Raises', target: 'Gastrocnemius & Soleus (Betis)', category: MuscleCategory.KAKI },

      // --- CORE ---
      { name: 'Planks', target: 'Transverse Abdominis (Kestabilan inti)', category: MuscleCategory.CORE },
      { name: 'Hanging Leg Raises', target: 'Lower Abs', category: MuscleCategory.CORE },
      { name: 'Russian Twists', target: 'Obliques (Samping perut)', category: MuscleCategory.CORE },
      { name: 'Cable Crunch', target: 'Rectus Abdominis (Six-pack)', category: MuscleCategory.CORE },
      { name: 'Bird Dog', target: 'Lower Back & Core Stability', category: MuscleCategory.CORE },

      // --- LENGAN (Tricep & Bicep) ---
      { name: 'Tricep Rope Pushdown', target: 'Lateral & Medial Head', category: MuscleCategory.LENGAN },
      { name: 'Skull Crushers', target: 'Long Head', category: MuscleCategory.LENGAN },
      { name: 'Diamond Push-ups', target: 'Tricep Keseluruhan', category: MuscleCategory.LENGAN },
      { name: 'Overhead Tricep Extension', target: 'Long Head', category: MuscleCategory.LENGAN },
      { name: 'Barbell Curl', target: 'Long & Short Head (Bicep keseluruhan)', category: MuscleCategory.LENGAN },
      { name: 'Hammer Curl', target: 'Brachialis & Forearms', category: MuscleCategory.LENGAN },
      { name: 'Preacher Curl', target: 'Short Head (Puncak bicep)', category: MuscleCategory.LENGAN },
      { name: 'Concentration Curl', target: 'Isolation (Puncak bicep)', category: MuscleCategory.LENGAN },
    ];

    // Fungsi sakti Prisma untuk memuat data sekaligus banyak!
    const result = await prisma.exercise.createMany({
      data: exercises,
      skipDuplicates: true, // Supaya kalau kepencet 2x, datanya nggak dobel
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} Gerakan berhasil dimasukkan ke database V-TRACK!`
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
