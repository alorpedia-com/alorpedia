import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { calculateAgeGrade } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { name, email, password, village, birthDate } = await req.json();

    // For phased registration, only email and password are required initially
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData: any = {
      email,
      password: hashedPassword,
      onboardingCompleted: false,
      onboardingStep: 2, // Start at step 2 (name collection)
    };

    // Add optional fields if provided
    if (name) userData.name = name;
    if (village) userData.village = village;
    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      userData.birthDate = birthDateObj;
      userData.ageGrade =
        calculateAgeGrade(birthDateObj.getFullYear())?.name || null;
      userData.onboardingCompleted = true;
      userData.onboardingStep = 5;
    }

    const user = await prisma.user.create({
      data: userData,
    });

    // Automatically create a profile for the user
    await prisma.profile.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: user.id,
        onboardingCompleted: user.onboardingCompleted,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
