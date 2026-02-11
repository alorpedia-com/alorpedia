import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      bio,
      name,
      profileImage,
      userType,
      village,
      kindred,
      hostVillage,
      birthYear,
      ageGrade,
      generationalRole,
    } = body;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Build update data for User table
    const userUpdateData: any = {};
    if (name !== undefined) userUpdateData.name = name;
    if (profileImage !== undefined) userUpdateData.profileImage = profileImage;
    if (userType !== undefined) userUpdateData.userType = userType;
    if (birthYear !== undefined) userUpdateData.birthYear = birthYear;
    if (ageGrade !== undefined) userUpdateData.ageGrade = ageGrade;
    if (generationalRole !== undefined)
      userUpdateData.generationalRole = generationalRole;

    // Handle village/kindred/hostVillage based on userType
    if (userType === "INDIGENE") {
      if (village !== undefined) userUpdateData.village = village;
      if (kindred !== undefined) userUpdateData.kindred = kindred;
      userUpdateData.hostVillage = null;
    } else if (userType === "NDI_OGO") {
      if (hostVillage !== undefined) userUpdateData.hostVillage = hostVillage;
      userUpdateData.village = null;
      userUpdateData.kindred = null;
    } else {
      // If userType is not being changed, handle fields individually
      if (village !== undefined) userUpdateData.village = village;
      if (kindred !== undefined) userUpdateData.kindred = kindred;
      if (hostVillage !== undefined) userUpdateData.hostVillage = hostVillage;
    }

    // Update User table if there are user fields to update
    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: userUpdateData,
      });
    }

    // Update Profile table if bio is provided
    if (bio !== undefined) {
      await prisma.profile.upsert({
        where: { userId: dbUser.id },
        update: { bio },
        create: {
          bio,
          userId: dbUser.id,
        },
      });
    }

    // Fetch and return updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: { profile: true },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        profileImage: updatedUser?.profileImage,
        userType: updatedUser?.userType,
        village: updatedUser?.village,
        kindred: updatedUser?.kindred,
        hostVillage: updatedUser?.hostVillage,
        birthYear: updatedUser?.birthYear,
        ageGrade: updatedUser?.ageGrade,
        generationalRole: updatedUser?.generationalRole,
        bio: updatedUser?.profile?.bio,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
