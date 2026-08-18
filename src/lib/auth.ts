import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import bcrypt from "bcryptjs";

import { authConfig } from "./auth.config";
import { prisma } from "./db";
import { normalizeIdentifier } from "./identifier";
import { getServerPostHog } from "./posthog-server";

const providers: Provider[] = [
  Credentials({
    id: "credentials",
    name: "Email or phone",
    credentials: {
      identifier: { label: "Email or phone", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const identifier = typeof raw?.identifier === "string" ? raw.identifier : "";
      const password = typeof raw?.password === "string" ? raw.password : "";
      if (!identifier || !password) return null;

      const parsed = normalizeIdentifier(identifier);
      if (!parsed) return null;

      const account = await prisma.account.findFirst({
        where:
          parsed.kind === "email" ? { email: parsed.value } : { phone: parsed.value },
      });
      if (!account?.passwordHash) return null;

      const ok = await bcrypt.compare(password, account.passwordHash);
      if (!ok) return null;

      return { id: account.id, email: account.email ?? undefined };
    },
  }),
];

// OAuth providers stay off until their keys exist, so the app boots without them.
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}
if (process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET) {
  providers.push(Apple);
}

export const enabledOAuthProviders = {
  google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
  apple: Boolean(process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET),
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (!account || !user) return token;

      if (account.provider === "credentials") {
        token.accountId = user.id;
        return token;
      }

      // OAuth: resolve (or create) our own accounts row. ageConfirmed stays
      // false so the age/ToS gate still runs before onboarding.
      const email = user.email?.toLowerCase();
      if (!email) return token;

      const record = await prisma.account.upsert({
        where: { email },
        update: {},
        create: {
          email,
          authProvider: account.provider === "apple" ? "apple" : "google",
          ageConfirmed: false,
        },
      });
      token.accountId = record.id;
      return token;
    },
  },
  events: {
    // signIn() throws a NEXT_REDIRECT on success, so success can't be
    // observed from inside loginAction/signUpAction directly — this event
    // fires exactly once per successful sign-in regardless of call site.
    // Scoped to credentials for now (no Google/Apple configured yet); user.id
    // is our own account id there since authorize() returns it directly.
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" || !user.id) return;
      const posthogServer = getServerPostHog();
      if (!posthogServer) return;
      posthogServer.capture({ distinctId: user.id, event: "login_succeeded" });
      await posthogServer.shutdown();
    },
  },
});
