import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        posts: {
          orderBy: { createdAt: "desc" },
        },
        discussions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!dbUser) {
      // Create user in Prisma if they exist in Supabase but not in Prisma
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name:
            user.user_metadata?.full_name || user.user_metadata?.name || "User",
          profileImage: user.user_metadata?.avatar_url || null,
          onboardingCompleted: false,
          onboardingStep: 0,
        },
        include: {
          profile: true,
          posts: true,
          discussions: true,
        },
      });
    }

    return NextResponse.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      profileImage: dbUser.profileImage,
      userType: dbUser.userType,
      village: dbUser.village,
      kindred: dbUser.kindred,
      hostVillage: dbUser.hostVillage,
      birthDate: dbUser.birthDate,
      birthYear: dbUser.birthYear,
      ageGrade: dbUser.ageGrade,
      generationalRole: dbUser.generationalRole,
      onboardingCompleted: dbUser.onboardingCompleted,
      onboardingStep: dbUser.onboardingStep,
      createdAt: dbUser.createdAt,
      bio: dbUser.profile?.bio,
      posts: dbUser.posts,
      discussions: dbUser.discussions,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
