require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3] || "password123";

  if (!email) {
    console.error(
      "Please provide an email: node scripts/reset-password.js <email> [newPassword]"
    );
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log(
      `Password reset successful for ${user.email}. New password is: ${newPassword}`
    );
  } catch (err) {
    console.error("Error resetting password:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
