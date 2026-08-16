"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "../db";
import { str } from "../form";

function checkToken(token: string): boolean {
  const expected = process.env.ADMIN_TOKEN;
  return Boolean(expected) && token === expected;
}

/** Clears the profile's outstanding reports and un-hides it. */
export async function clearProfileAction(form: FormData) {
  const token = str(form, "token");
  if (!checkToken(token)) return;

  const profileId = str(form, "profileId");
  if (!profileId) return;

  await prisma.$transaction([
    prisma.report.updateMany({
      where: { reportedProfileId: profileId, reviewedAt: null },
      data: { reviewedAt: new Date() },
    }),
    prisma.profile.update({ where: { id: profileId }, data: { hidden: false } }),
  ]);

  revalidatePath("/admin/review");
}

/** Confirms the reports were legitimate; keeps the profile hidden. */
export async function confirmHiddenAction(form: FormData) {
  const token = str(form, "token");
  if (!checkToken(token)) return;

  const profileId = str(form, "profileId");
  if (!profileId) return;

  await prisma.report.updateMany({
    where: { reportedProfileId: profileId, reviewedAt: null },
    data: { reviewedAt: new Date() },
  });

  revalidatePath("/admin/review");
}
