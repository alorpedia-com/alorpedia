import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // console.log("middleware query", req.nextUrl.pathname);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/archive/create",
    "/dialogue/create",
    "/tree/:path*",
    // Add other protected routes here
  ],
};
