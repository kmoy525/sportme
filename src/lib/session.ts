import "server-only";
import { redirect } from "next/navigation";

import { auth } from "./auth";
import { prisma } from "./db";

export async function getAccountId(): Promise<string | null> {
  const session = await auth();
  return session?.accountId ?? null;
}

export async function getAccount() {
  const accountId = await getAccountId();
  if (!accountId) return null;
  return prisma.account.findUnique({
    where: { id: accountId },
    include: { profile: true },
  });
}

/** Signed in, but not necessarily past the age gate or onboarding. */
export async function requireAccount() {
  const account = await getAccount();
  if (!account) redirect("/login");
  return account;
}

/**
 * The full gate: signed in -> age/ToS confirmed -> onboarded.
 * Every authenticated page funnels through this.
 */
export async function requireProfile() {
  const account = await requireAccount();

  if (!account.ageConfirmed || !account.tosAcceptedAt) {
    redirect("/signup/confirm");
  }
  if (!account.profile) {
    redirect("/onboarding");
  }
  return { account, profile: account.profile };
}

/** Profile shape safe to hand to client components — no lat/lng, no zip. */
export type PublicProfile = {
  id: string;
  name: string;
  ageRange: string;
  photoUrl: string | null;
};

export function toPublicProfile(p: {
  id: string;
  name: string;
  ageRange: string;
  photoUrl: string | null;
}): PublicProfile {
  return {
    id: p.id,
    name: p.name,
    ageRange: p.ageRange,
    photoUrl: p.photoUrl,
  };
}
