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

      // Use upsert to handle existing users or race conditions
      const dbUser = await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            "User",
          profileImage: data.user.user_metadata?.avatar_url || null,
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            "User",
          profileImage: data.user.user_metadata?.avatar_url || null,
          onboardingCompleted: false,
          onboardingStep: 2,
          profile: {
            create: {},
          },
        },
      });

      // Redirect to onboarding or profile
      const redirectPath = dbUser.onboardingCompleted ? next : "/onboarding";
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalHost = forwardedHost?.includes("localhost");

      const targetUrl = isLocalHost
        ? `${origin}${redirectPath}`
        : forwardedHost
          ? `https://${forwardedHost}${redirectPath}`
          : `${origin}${redirectPath}`;

      return NextResponse.redirect(targetUrl);
    }
  }

  // Return user to an error page with some instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
