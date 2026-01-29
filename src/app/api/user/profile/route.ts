import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

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
      // Use upsert to prevent race conditions during parallel creation requests
      try {
        console.log(
          "Creating/Ensuring user in Prisma for Supabase ID:",
          user.id,
        );
        const name =
          user.user_metadata?.full_name || user.user_metadata?.name || "User";
        const profileImage = user.user_metadata?.avatar_url || null;

        dbUser = await prisma.user.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            email: user.email!,
            name:
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              "User",
            profileImage: user.user_metadata?.avatar_url || null,
            onboardingCompleted: false,
            onboardingStep: 2,
            profile: {
              create: {},
            },
          },
          update: {
            // Update email or name if they changed (optional)
            email: user.email!,
            name,
          },
          include: {
            profile: true,
            posts: true,
            discussions: true,
          },
        });
        console.log("Successfully ensured user in Prisma:", dbUser.id);
      } catch (createError) {
        console.error(
          "CRITICAL: Failed to ensure user in Prisma:",
          createError,
        );
        throw createError;
      }
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
  } catch (error: any) {
    console.error("Profile fetch error detail:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
