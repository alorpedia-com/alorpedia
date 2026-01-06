import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to homepage
    if (path === "/") {
      return NextResponse.next();
    }

    // Allow access to auth pages
    const authPages = ["/login", "/register"];
    if (authPages.some((page) => path.startsWith(page))) {
      return NextResponse.next();
    }

    // Allow access to onboarding page
    if (path.startsWith("/onboarding")) {
      return NextResponse.next();
    }

    // Check if user has completed onboarding
    if (token && !token.onboardingCompleted) {
      // Redirect to onboarding if not completed
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Allow unauthenticated access to homepage and auth pages
        if (
          path === "/" ||
          path.startsWith("/login") ||
          path.startsWith("/register")
        ) {
          return true;
        }
        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo files
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo|.*\\.jpg|.*\\.png|.*\\.svg).*)",
  ],
};
