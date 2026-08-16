import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth.config";

// A separate, providerless NextAuth instance so middleware's Edge bundle
// never pulls in Prisma/bcrypt (see auth.config.ts).
const { auth } = NextAuth(authConfig);

/**
 * Coarse gate: bounce signed-out visitors away from authenticated routes.
 * The finer-grained age/ToS/onboarding gate lives in requireProfile(),
 * which every (app) page already runs through its layout.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthed = Boolean(req.auth?.accountId);

  const publicPaths = ["/login", "/signup", "/terms", "/api/auth"];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isAuthed && !isPublic && !pathname.startsWith("/admin")) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
