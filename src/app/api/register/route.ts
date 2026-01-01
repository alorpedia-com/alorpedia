import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { calculateAgeGrade } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { name, email, password, village, birthDate } = await req.json();

    if (!email || !password || !village || !birthDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const birthDateObj = new Date(birthDate);
    const ageGrade = calculateAgeGrade(birthDateObj);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        village,
        birthDate: birthDateObj,
        ageGrade,
      },
    });

    // Automatically create a profile for the user
    await prisma.profile.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
