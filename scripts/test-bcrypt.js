require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = "test@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
        name: "Test User",
        village: "Umunri",
        birthDate: new Date("1990-01-01"),
        ageGrade: "Test Grade",
      },
    });

    console.log("Test user created/updated:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Immediate comparison check:", isMatch);
  } catch (err) {
    console.error("Error creating test user:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
