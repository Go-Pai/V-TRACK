import "dotenv/config";
import { prisma } from "../lib/prisma";

const exercises = [
  { name: "Decline Push-ups", target: "Upper Chest", category: "DADA" },
  { name: "Weighted Dips", target: "Lower Chest & Triceps", category: "DADA" },
  { name: "Dumbbell Pullover", target: "Chest & Serratus", category: "DADA" },
  { name: "Machine Chest Press", target: "Middle Chest", category: "DADA" },
  { name: "Pec Deck Fly", target: "Inner Chest", category: "DADA" },

  { name: "T-Bar Row", target: "Middle Back", category: "PUNGGUNG" },
  { name: "Straight-Arm Lat Pulldown", target: "Lats", category: "PUNGGUNG" },
  { name: "Inverted Row", target: "Upper Back & Rear Delts", category: "PUNGGUNG" },
  { name: "Good Mornings", target: "Lower Back & Hamstrings", category: "PUNGGUNG" },
  { name: "Rack Pulls", target: "Full Back", category: "PUNGGUNG" },

  { name: "Seated Dumbbell Press", target: "Front & Side Delts", category: "BAHU" },
  { name: "Cable Lateral Raise", target: "Side Delts", category: "BAHU" },
  { name: "Behind-the-Neck Press", target: "Overall Delts", category: "BAHU" },
  { name: "Y-Raise", target: "Rear Delts & Traps", category: "BAHU" },
  { name: "Lu Raises", target: "Side Delts", category: "BAHU" },

  { name: "Hack Squat", target: "Quadriceps", category: "KAKI" },
  { name: "Goblet Squats", target: "Quadriceps & Core", category: "KAKI" },
  { name: "Stiff-Legged Deadlift", target: "Hamstrings", category: "KAKI" },
  { name: "Sissy Squats", target: "Lower Quadriceps", category: "KAKI" },
  { name: "Glute Bridges", target: "Glutes", category: "KAKI" },

  { name: "Ab Wheel Rollout", target: "Rectus Abdominis", category: "CORE" },
  { name: "Leg Raises (Berbaring)", target: "Lower Abs", category: "CORE" },
  { name: "Side Plank", target: "Obliques", category: "CORE" },
  { name: "V-Ups", target: "Upper & Lower Abs", category: "CORE" },
  { name: "Dragon Flag", target: "Full Core", category: "CORE" },

  { name: "Battle Ropes", target: "Endurance & Full Body", category: "CARDIO" },
  { name: "Rowing Machine", target: "Cardio & Back Strength", category: "CARDIO" },
  { name: "Box Jumps", target: "Explosive Power", category: "CARDIO" },
  { name: "Stair Climber", target: "Lower Body Endurance", category: "CARDIO" },
  { name: "Shadow Boxing", target: "Cardio & Coordination", category: "CARDIO" },

  { name: "Tricep Kickbacks", target: "Lateral Head", category: "LENGAN" },
  { name: "Ez-Bar Skull Crushers", target: "Long Head", category: "LENGAN" },
  { name: "Single Arm Cable Pushdown", target: "Triceps", category: "LENGAN" },
  { name: "Weighted Bench Dips", target: "Triceps", category: "LENGAN" },

  { name: "Dumbbell Curl", target: "Bicep keseluruhan", category: "LENGAN" },
  { name: "Hammer Curl (Rope)", target: "Brachialis", category: "LENGAN" },
  { name: "Reverse Grip Curl", target: "Brachioradialis", category: "LENGAN" },
  { name: "Zottman Curl", target: "Bicep & Forearm", category: "LENGAN" }
];

async function main() {
  console.log("Starting seed...");
  await prisma.exercise.deleteMany({
    where: { userId: null }
  });
  console.log("Cleared existing global exercises.");
  for (const ex of exercises) {
    await prisma.exercise.create({
      data: {
        name: ex.name,
        target: ex.target,
        category: ex.category as any,
      },
    });
    console.log(`Created: ${ex.name}`);
  }
  console.log("Seed finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
