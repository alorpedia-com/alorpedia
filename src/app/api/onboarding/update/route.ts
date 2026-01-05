import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateAgeGrade } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { step, data } = body;

    const userId = (session.user as any).id;

    // Update user based on current step
    const updateData: any = {
      onboardingStep: step + 1,
    };

    if (step === 2 && data.name) {
      updateData.name = data.name;
    }

    if (step === 3 && data.profileImage) {
      updateData.profileImage = data.profileImage;
    }

    if (step === 4 && data.village && data.birthDate) {
      const birthDate = new Date(data.birthDate);
      updateData.village = data.village;
      updateData.birthDate = birthDate;
      updateData.ageGrade = calculateAgeGrade(birthDate);
      updateData.onboardingCompleted = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        village: updatedUser.village,
        ageGrade: updatedUser.ageGrade,
        onboardingCompleted: updatedUser.onboardingCompleted,
        onboardingStep: updatedUser.onboardingStep,
      },
    });
  } catch (error) {
    console.error("Onboarding update error:", error);
    return NextResponse.json(
      { error: "Failed to update onboarding progress" },
      { status: 500 }
    );
  }
}
