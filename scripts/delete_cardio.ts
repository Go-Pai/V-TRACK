import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Deleting CARDIO exercises...");
  const result = await prisma.exercise.deleteMany({
    where: { category: "CARDIO" as any },
  });
  console.log(`Deleted ${result.count} CARDIO exercises.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
