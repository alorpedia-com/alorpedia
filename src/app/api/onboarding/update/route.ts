import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    if (step === 4) {
      // Handle cultural identity data
      updateData.userType = data.userType;
      updateData.birthYear = data.birthYear;
      updateData.ageGrade = data.ageGrade;
      updateData.generationalRole = data.generationalRole;

      if (data.userType === "INDIGENE") {
        // Indigenes have village and kindred
        updateData.village = data.village;
        updateData.kindred = data.kindred;
        updateData.hostVillage = null;
      } else {
        // Ndi Ogo have host village only
        updateData.hostVillage = data.hostVillage;
        updateData.village = null;
        updateData.kindred = null;
      }

      updateData.onboardingCompleted = true;
    }

    console.log(`Updating user ${userId} for step ${step}:`, updateData);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        userType: true,
        village: true,
        kindred: true,
        hostVillage: true,
        birthYear: true,
        ageGrade: true,
        generationalRole: true,
        onboardingCompleted: true,
        onboardingStep: true,
      },
    });

    console.log(
      `User ${userId} updated successfully. onboardingCompleted: ${updatedUser.onboardingCompleted}`
    );

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding update error:", error);
    return NextResponse.json(
      { error: "Failed to update onboarding progress" },
      { status: 500 }
    );
  }
}
