import "server-only";

import { prisma } from "./db";

/**
 * A profile hidden from all feeds pending manual review once it accumulates
 * this many reports.
 */
export const AUTO_HIDE_REPORT_THRESHOLD = 3;

/**
 * Ids the viewer must never see, and who must never see the viewer.
 * Blocking is symmetric in effect and retroactive — it also hides existing
 * matches and chats (see chatVisibleTo).
 */
export async function blockedIds(profileId: string): Promise<string[]> {
  const rows = await prisma.block.findMany({
    where: {
      OR: [{ blockerProfileId: profileId }, { blockedProfileId: profileId }],
    },
    select: { blockerProfileId: true, blockedProfileId: true },
  });

  const ids = new Set<string>();
  for (const row of rows) {
    ids.add(row.blockerProfileId === profileId ? row.blockedProfileId : row.blockerProfileId);
  }
  return [...ids];
}

export async function isBlockedBetween(a: string, b: string): Promise<boolean> {
  const found = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerProfileId: a, blockedProfileId: b },
        { blockerProfileId: b, blockedProfileId: a },
      ],
    },
    select: { id: true },
  });
  return Boolean(found);
}

/**
 * Re-evaluates the auto-hide threshold for a reported profile. Never deletes —
 * just flags hidden so the admin review queue can pick it up.
 */
export async function applyAutoHide(reportedProfileId: string): Promise<boolean> {
  const count = await prisma.report.count({
    where: { reportedProfileId, reviewedAt: null },
  });
  if (count < AUTO_HIDE_REPORT_THRESHOLD) return false;

  await prisma.profile.update({
    where: { id: reportedProfileId },
    data: { hidden: true },
  });
  return true;
}
