"use server";

import { revalidatePath } from "next/cache";

import { str } from "../form";
import {
  recordLike,
  recordPass,
  resetPasses,
  type LikeOutcome,
} from "../matching";
import { requireProfile } from "../session";
import { parseSport } from "../sports";
import { isBlockedBetween } from "../visibility";
import { prisma } from "../db";

export type ThumbResult =
  | { ok: false; error: string }
  | { ok: true; outcome: LikeOutcome };

export async function thumbsUpAction(
  targetProfileId: string,
  sportValue: string,
): Promise<ThumbResult> {
  const { profile } = await requireProfile();
  const sport = parseSport(sportValue);
  if (!sport) return { ok: false, error: "Unknown sport." };
  if (targetProfileId === profile.id) return { ok: false, error: "That's you." };

  if (await isBlockedBetween(profile.id, targetProfileId)) {
    return { ok: false, error: "That profile is unavailable." };
  }

  const target = await prisma.profile.findFirst({
    where: { id: targetProfileId, hidden: false },
    select: { id: true },
  });
  if (!target) return { ok: false, error: "That profile is unavailable." };

  const outcome = await recordLike(profile.id, targetProfileId, sport);

  revalidatePath(`/sports/${sport}`);
  revalidatePath("/notifications");
  return { ok: true, outcome };
}

export async function thumbsDownAction(
  targetProfileId: string,
  sportValue: string,
): Promise<ThumbResult> {
  const { profile } = await requireProfile();
  const sport = parseSport(sportValue);
  if (!sport) return { ok: false, error: "Unknown sport." };

  await recordPass(profile.id, targetProfileId, sport);

  revalidatePath(`/sports/${sport}`);
  revalidatePath("/notifications");
  return { ok: true, outcome: { matched: false } };
}

export type MatchedInfo = { chatId: string; partnerName: string; sport: string };

export type RespondResult =
  | { ok: false; error: string }
  | { ok: true; matched: MatchedInfo | null };

/**
 * Notifications tab: respond to someone who already wants to train with you.
 * They may have thumbed you up in more than one sport, so this answers all of
 * them at once.
 */
export async function respondToLikesAction(
  targetProfileId: string,
  sportValues: string[],
  liked: boolean,
): Promise<RespondResult> {
  const { profile } = await requireProfile();

  const sports = sportValues.map(parseSport).filter((s) => s !== null);
  if (sports.length === 0) return { ok: false, error: "Unknown sport." };

  if (liked && (await isBlockedBetween(profile.id, targetProfileId))) {
    return { ok: false, error: "That profile is unavailable." };
  }

  let matched: MatchedInfo | null = null;

  for (const sport of sports) {
    if (!liked) {
      await recordPass(profile.id, targetProfileId, sport);
      continue;
    }
    const outcome = await recordLike(profile.id, targetProfileId, sport);
    if (outcome.matched && !matched) {
      matched = {
        chatId: outcome.chatId,
        partnerName: outcome.partnerName,
        sport,
      };
    }
  }

  revalidatePath("/notifications");
  return matched ? { ok: true, matched } : { ok: true, matched: null };
}

/** "You've run out of people, would you like to see the list again?" */
export async function seeListAgainAction(form: FormData) {
  const { profile } = await requireProfile();
  const sport = parseSport(str(form, "sport"));
  if (!sport) return;

  await resetPasses(profile.id, sport);
  revalidatePath(`/sports/${sport}`);
}
