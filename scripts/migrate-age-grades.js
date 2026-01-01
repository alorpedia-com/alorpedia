const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Manually load .env
let connectionString = process.env.DATABASE_URL;
try {
  const envPath = path.resolve(__dirname, "../.env");
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      value = value.replace(/^["'](.*)["']$/, "$1");
      if (key === "DATABASE_URL") connectionString = value;
      process.env[key] = value;
    }
  });
} catch (err) {
  console.warn(
    "Could not load .env file manually, relying on existing environment variables."
  );
}
// No external TS imports needed as we have calculateAgeGradeJS below

// Note: Since this is a vanilla JS script, we might need a JS version of calculateAgeGrade
// or use ts-node to run it. Given the environment, I'll write a standalone JS version
// for the migration script to ensure it runs without dependency issues.

function calculateAgeGradeJS(birthDate) {
  const year = birthDate.getFullYear();
  const baseYear = 1940;
  const period = 3;

  if (year < baseYear) return "Council of Elders (< 1940)";

  const diff = year - baseYear;
  const gradeIndex = Math.floor(diff / period);
  const startYear = baseYear + gradeIndex * period;
  const endYear = startYear + period - 1;

  const names = [
    "Ancient Roots",
    "Wisdom Keepers",
    "Heritage Guardians",
    "Community Pillars",
    "Bridge Builders",
    "Cultural Sentinels",
    "Golden Generation",
    "Future Seedlings",
    "Morning Dew",
    "Rising Pioneers",
    "New Horizons",
  ];

  const name = names[gradeIndex % names.length];
  return `${name} (${startYear}-${endYear})`;
}

async function migrate() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  try {
    const users = await prisma.user.findMany();
    console.log(`Migrating ${users.length} users...`);

    for (const user of users) {
      if (user.birthDate) {
        const newAgeGrade = calculateAgeGradeJS(new Date(user.birthDate));
        await prisma.user.update({
          where: { id: user.id },
          data: { ageGrade: newAgeGrade },
        });
        console.log(`Updated ${user.email}: ${newAgeGrade}`);
      }
    }
    console.log("Migration complete.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
