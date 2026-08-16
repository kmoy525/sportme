"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { isReportReason } from "../enums";
import { str, type FormState } from "../form";
import { requireProfile } from "../session";
import { applyAutoHide } from "../visibility";

export async function blockProfileAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();
  const blockedProfileId = str(form, "profileId");

  if (!blockedProfileId || blockedProfileId === profile.id) {
    return { error: "Couldn't block that profile." };
  }

  await prisma.block.upsert({
    where: {
      blockerProfileId_blockedProfileId: {
        blockerProfileId: profile.id,
        blockedProfileId,
      },
    },
    update: {},
    create: { blockerProfileId: profile.id, blockedProfileId },
  });

  // Blocking is retroactive: existing matches and their chats disappear for
  // both sides. Reads filter on blocks, so nothing needs deleting here.
  revalidatePath("/notifications");
  revalidatePath("/profile/blocked");
  redirect("/notifications");
}

export async function unblockProfileAction(form: FormData) {
  const { profile } = await requireProfile();
  const blockedProfileId = str(form, "profileId");
  if (!blockedProfileId) return;

  await prisma.block.deleteMany({
    where: { blockerProfileId: profile.id, blockedProfileId },
  });

  revalidatePath("/profile/blocked");
  revalidatePath("/notifications");
}

export async function reportProfileAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();

  const reportedProfileId = str(form, "profileId");
  const reasonRaw = str(form, "reason");
  const notes = str(form, "notes");
  const alsoBlock = str(form, "alsoBlock") === "on";

  if (!reportedProfileId || reportedProfileId === profile.id) {
    return { error: "Couldn't report that profile." };
  }
  if (!isReportReason(reasonRaw)) {
    return { fieldErrors: { reason: "Pick a reason." } };
  }

  await prisma.report.upsert({
    where: {
      reporterProfileId_reportedProfileId: {
        reporterProfileId: profile.id,
        reportedProfileId,
      },
    },
    update: { reason: reasonRaw, notes: notes || null },
    create: {
      reporterProfileId: profile.id,
      reportedProfileId,
      reason: reasonRaw,
      notes: notes || null,
    },
  });

  await applyAutoHide(reportedProfileId);

  if (alsoBlock) {
    await prisma.block.upsert({
      where: {
        blockerProfileId_blockedProfileId: {
          blockerProfileId: profile.id,
          blockedProfileId: reportedProfileId,
        },
      },
      update: {},
      create: { blockerProfileId: profile.id, blockedProfileId: reportedProfileId },
    });
  }

  revalidatePath("/notifications");
  redirect("/report/thanks");
}
