import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe slice of the NextAuth config: no providers, no Prisma, no bcrypt.
 * middleware.ts builds its own lightweight NextAuth instance from this so its
 * Edge bundle never pulls in `@prisma/client` (which needs `node:crypto`).
 *
 * The full config in auth.ts spreads this and adds providers + the jwt
 * callback; that instance is only ever used from route handlers and server
 * components/actions, which run on the Node.js runtime.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/login", newUser: "/onboarding" },
  callbacks: {
    session({ session, token }) {
      if (typeof token.accountId === "string") {
        session.accountId = token.accountId;
        if (session.user) session.user.id = token.accountId;
      }
      return session;
    },
  },
};
