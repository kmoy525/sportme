import "server-only";

import type { Sport } from "@/generated/prisma/enums";

import { prisma } from "./db";
import { blockedIds } from "./visibility";

export type IncomingLike = {
  profileId: string;
  name: string;
  photoUrl: string | null;
  ageRange: string;
  sports: Sport[];
  createdAt: Date;
};

/**
 * Incoming thumbs-ups the viewer hasn't reciprocated.
 * Copy is "[Name] wants to train with you" — never "liked you".
 */
export async function getIncomingLikes(profileId: string): Promise<IncomingLike[]> {
  const blocked = await blockedIds(profileId);

  const [received, given] = await Promise.all([
    prisma.like.findMany({
      where: {
        toProfileId: profileId,
        fromProfileId: blocked.length ? { notIn: blocked } : undefined,
        fromProfile: { hidden: false },
      },
      orderBy: { createdAt: "desc" },
      select: {
        sport: true,
        createdAt: true,
        fromProfile: {
          select: { id: true, name: true, photoUrl: true, ageRange: true },
        },
      },
    }),
    prisma.like.findMany({
      where: { fromProfileId: profileId },
      select: { toProfileId: true, sport: true },
    }),
  ]);

  const reciprocated = new Set(given.map((l) => `${l.toProfileId}:${l.sport}`));

  const byProfile = new Map<string, IncomingLike>();
  for (const like of received) {
    if (reciprocated.has(`${like.fromProfile.id}:${like.sport}`)) continue;

    const existing = byProfile.get(like.fromProfile.id);
    if (existing) {
      existing.sports.push(like.sport);
      continue;
    }
    byProfile.set(like.fromProfile.id, {
      profileId: like.fromProfile.id,
      name: like.fromProfile.name,
      photoUrl: like.fromProfile.photoUrl,
      ageRange: like.fromProfile.ageRange,
      sports: [like.sport],
      createdAt: like.createdAt,
    });
  }

  return [...byProfile.values()];
}

export type PartnerSummary = {
  profileId: string;
  chatId: string | null;
  name: string;
  photoUrl: string | null;
  sports: Sport[];
  lastMessage: { content: string; createdAt: Date; fromViewer: boolean } | null;
  lastActivity: Date;
};

/**
 * The viewer's Training Partners. Blocking is retroactive, so blocked pairs
 * drop out of this list along with their chats.
 */
export async function getPartners(profileId: string): Promise<PartnerSummary[]> {
  const blocked = await blockedIds(profileId);

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ profileAId: profileId }, { profileBId: profileId }],
      AND: blocked.length
        ? [
            { profileAId: { notIn: blocked } },
            { profileBId: { notIn: blocked } },
          ]
        : undefined,
    },
    select: {
      id: true,
      sport: true,
      createdAt: true,
      profileAId: true,
      profileBId: true,
      profileA: { select: { id: true, name: true, photoUrl: true, hidden: true } },
      profileB: { select: { id: true, name: true, photoUrl: true, hidden: true } },
      chat: {
        select: {
          id: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, createdAt: true, senderProfileId: true },
          },
        },
      },
    },
  });

  const byPartner = new Map<string, PartnerSummary>();

  for (const match of matches) {
    const other = match.profileAId === profileId ? match.profileB : match.profileA;
    if (other.hidden) continue;

    const message = match.chat?.messages[0] ?? null;
    const lastActivity = message?.createdAt ?? match.createdAt;

    const existing = byPartner.get(other.id);
    if (existing) {
      // Matched in more than one sport — one row, all the sports listed.
      existing.sports.push(match.sport);
      if (lastActivity > existing.lastActivity) {
        existing.lastActivity = lastActivity;
        existing.chatId = match.chat?.id ?? existing.chatId;
        existing.lastMessage = message
          ? {
              content: message.content,
              createdAt: message.createdAt,
              fromViewer: message.senderProfileId === profileId,
            }
          : existing.lastMessage;
      }
      continue;
    }

    byPartner.set(other.id, {
      profileId: other.id,
      chatId: match.chat?.id ?? null,
      name: other.name,
      photoUrl: other.photoUrl,
      sports: [match.sport],
      lastMessage: message
        ? {
            content: message.content,
            createdAt: message.createdAt,
            fromViewer: message.senderProfileId === profileId,
          }
        : null,
      lastActivity,
    });
  }

  return [...byPartner.values()].sort(
    (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime(),
  );
}

/** True once the two profiles are Training Partners in any sport. */
export async function arePartners(a: string, b: string): Promise<boolean> {
  const [profileAId, profileBId] = a < b ? [a, b] : [b, a];
  const found = await prisma.match.findFirst({
    where: { profileAId, profileBId },
    select: { id: true },
  });
  return Boolean(found);
}
