import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Import prisma dynamically to avoid edge runtime issues
      const prisma = (await import("@/lib/prisma")).default;

      // Check if user exists in database
      let dbUser = await prisma.user.findUnique({
        where: { id: data.user.id },
      });

      // If user doesn't exist, create them
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              "User",
            profileImage: data.user.user_metadata?.avatar_url || null,
            onboardingCompleted: false,
            onboardingStep: 0,
          },
        });

        // Redirect to onboarding for new users
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalHost = forwardedHost?.includes("localhost");
        if (isLocalHost) {
          return NextResponse.redirect(`${origin}/onboarding`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}/onboarding`);
        } else {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      // For existing users, redirect to requested page or profile
      const redirectPath = dbUser.onboardingCompleted ? next : "/onboarding";
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalHost = forwardedHost?.includes("localhost");
      if (isLocalHost) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // Return user to an error page with some instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
