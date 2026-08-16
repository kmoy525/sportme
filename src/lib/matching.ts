import "server-only";

import type { Sport } from "@/generated/prisma/enums";

import { prisma } from "./db";
import { boundingBox, milesBetween } from "./distance";
import { blockedIds } from "./visibility";

export type DeckCandidate = {
  profileId: string;
  name: string;
  ageRange: string;
  photoUrl: string | null;
  bjj: {
    belt: string;
    gym: string | null;
    weightClass: string | null;
  } | null;
  /** Server-side only — used for ordering, never serialized to the client. */
  distanceMiles: number;
  /** True when this person already thumbs-upped the viewer. */
  likesViewer: boolean;
};

type Viewer = {
  id: string;
  lat: number;
  lng: number;
  travelRadiusMiles: number;
};

/** Deterministic pair ordering so the unique constraint dedupes a pair. */
export function orderPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

/**
 * Everyone the viewer could still see in this sport, nearest first.
 * Ordering is distance-based only — no scoring, and distance is never returned
 * to the client.
 */
export async function getCandidates(
  viewer: Viewer,
  sport: Sport,
  opts: { includePassed?: boolean; likedViewerFirst?: boolean } = {},
): Promise<DeckCandidate[]> {
  const box = boundingBox(viewer, viewer.travelRadiusMiles);

  const [blocked, likesGiven, passesGiven, matches, likesReceived] = await Promise.all([
    blockedIds(viewer.id),
    prisma.like.findMany({
      where: { fromProfileId: viewer.id, sport },
      select: { toProfileId: true },
    }),
    prisma.pass.findMany({
      where: { fromProfileId: viewer.id, sport },
      select: { toProfileId: true },
    }),
    prisma.match.findMany({
      where: {
        sport,
        OR: [{ profileAId: viewer.id }, { profileBId: viewer.id }],
      },
      select: { profileAId: true, profileBId: true },
    }),
    prisma.like.findMany({
      where: { toProfileId: viewer.id, sport },
      select: { fromProfileId: true },
    }),
  ]);

  const excluded = new Set<string>([viewer.id, ...blocked]);
  for (const l of likesGiven) excluded.add(l.toProfileId);
  for (const m of matches) {
    excluded.add(m.profileAId === viewer.id ? m.profileBId : m.profileAId);
  }
  if (!opts.includePassed) {
    for (const p of passesGiven) excluded.add(p.toProfileId);
  }

  const likedViewer = new Set(likesReceived.map((l) => l.fromProfileId));

  const rows = await prisma.sportProfile.findMany({
    where: {
      sport,
      optedIntoMatching: true,
      profileId: { notIn: [...excluded] },
      profile: {
        hidden: false,
        lat: { gte: box.minLat, lte: box.maxLat },
        lng: { gte: box.minLng, lte: box.maxLng },
      },
    },
    select: {
      profileId: true,
      bjj: { select: { belt: true, gym: true, weightClass: true } },
      profile: {
        select: {
          id: true,
          name: true,
          ageRange: true,
          photoUrl: true,
          lat: true,
          lng: true,
        },
      },
    },
  });

  const candidates: DeckCandidate[] = [];
  for (const row of rows) {
    const distanceMiles = milesBetween(viewer, {
      lat: row.profile.lat,
      lng: row.profile.lng,
    });
    // The bounding box over-selects at the corners; enforce the real radius.
    if (distanceMiles > viewer.travelRadiusMiles) continue;

    candidates.push({
      profileId: row.profile.id,
      name: row.profile.name,
      ageRange: row.profile.ageRange,
      photoUrl: row.profile.photoUrl,
      bjj: row.bjj
        ? {
            belt: row.bjj.belt,
            gym: row.bjj.gym,
            weightClass: row.bjj.weightClass,
          }
        : null,
      distanceMiles,
      likesViewer: likedViewer.has(row.profile.id),
    });
  }

  candidates.sort((a, b) => {
    if (opts.likedViewerFirst && a.likesViewer !== b.likesViewer) {
      return a.likesViewer ? -1 : 1;
    }
    return a.distanceMiles - b.distanceMiles;
  });

  return candidates;
}

/** Has the viewer passed on anyone in this sport? Drives the re-surface prompt. */
export async function hasPasses(profileId: string, sport: Sport): Promise<boolean> {
  const found = await prisma.pass.findFirst({
    where: { fromProfileId: profileId, sport },
    select: { id: true },
  });
  return Boolean(found);
}

export type LikeOutcome =
  | { matched: false }
  | { matched: true; matchId: string; chatId: string; partnerName: string };

/**
 * Records a thumbs-up and, if it completes a reciprocal pair, creates the
 * Training Partner + its chat in the same transaction.
 */
export async function recordLike(
  fromProfileId: string,
  toProfileId: string,
  sport: Sport,
): Promise<LikeOutcome> {
  await prisma.like.upsert({
    where: { fromProfileId_toProfileId_sport: { fromProfileId, toProfileId, sport } },
    update: {},
    create: { fromProfileId, toProfileId, sport },
  });

  // A thumbs-up supersedes an earlier pass on the same person.
  await prisma.pass.deleteMany({ where: { fromProfileId, toProfileId, sport } });

  const reciprocal = await prisma.like.findUnique({
    where: {
      fromProfileId_toProfileId_sport: {
        fromProfileId: toProfileId,
        toProfileId: fromProfileId,
        sport,
      },
    },
    select: { id: true },
  });
  if (!reciprocal) return { matched: false };

  const [profileAId, profileBId] = orderPair(fromProfileId, toProfileId);

  const match = await prisma.match.upsert({
    where: { profileAId_profileBId_sport: { profileAId, profileBId, sport } },
    update: {},
    create: { profileAId, profileBId, sport },
    select: { id: true },
  });

  // chat_id is 1:1 with match, created the same moment as the match.
  const chat = await prisma.chat.upsert({
    where: { matchId: match.id },
    update: {},
    create: { matchId: match.id },
    select: { id: true },
  });

  const partner = await prisma.profile.findUnique({
    where: { id: toProfileId },
    select: { name: true },
  });

  return {
    matched: true,
    matchId: match.id,
    chatId: chat.id,
    partnerName: partner?.name ?? "your training partner",
  };
}

/** Thumbs-down. Soft — cleared wholesale by resetPasses. */
export async function recordPass(
  fromProfileId: string,
  toProfileId: string,
  sport: Sport,
): Promise<void> {
  await prisma.pass.upsert({
    where: { fromProfileId_toProfileId_sport: { fromProfileId, toProfileId, sport } },
    update: {},
    create: { fromProfileId, toProfileId, sport },
  });
}

/** "You've run out of people, would you like to see the list again?" */
export async function resetPasses(profileId: string, sport: Sport): Promise<void> {
  await prisma.pass.deleteMany({ where: { fromProfileId: profileId, sport } });
}

/** Count for the Notifications page's "wants to train with you" list. */
export async function pendingLikeCount(profileId: string): Promise<number> {
  const blocked = await blockedIds(profileId);

  const received = await prisma.like.findMany({
    where: {
      toProfileId: profileId,
      fromProfileId: { notIn: blocked.length ? blocked : undefined },
      fromProfile: { hidden: false },
    },
    select: { fromProfileId: true, sport: true },
  });
  if (received.length === 0) return 0;

  const reciprocated = await prisma.like.findMany({
    where: { fromProfileId: profileId },
    select: { toProfileId: true, sport: true },
  });
  const mine = new Set(reciprocated.map((l) => `${l.toProfileId}:${l.sport}`));

  const people = new Set(
    received
      .filter((l) => !mine.has(`${l.fromProfileId}:${l.sport}`))
      .map((l) => l.fromProfileId),
  );
  return people.size;
}
