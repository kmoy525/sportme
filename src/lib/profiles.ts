import "server-only";

import type { Sport } from "@/generated/prisma/enums";

import { prisma } from "./db";
import { arePartners } from "./notifications";
import { isBlockedBetween } from "./visibility";

export type VisibleSportProfile = {
  sport: Sport;
  bjj: {
    belt: string;
    gym: string | null;
    weightClass: string | null;
  } | null;
};

export type VisibleProfile = {
  id: string;
  name: string;
  ageRange: string;
  photoUrl: string | null;
  sportProfiles: VisibleSportProfile[];
  isPartner: boolean;
};

/**
 * Another member's profile as the viewer is allowed to see it.
 *
 * Cross-sport visibility: once the two are Training Partners in any sport, all
 * of that member's opted-in sport profiles become visible. Otherwise only the
 * sports passed in `limitToSports` are shown.
 */
export async function getVisibleProfile(
  viewerId: string,
  targetId: string,
  limitToSports?: Sport[],
): Promise<VisibleProfile | null> {
  if (viewerId === targetId) return null;
  if (await isBlockedBetween(viewerId, targetId)) return null;

  const target = await prisma.profile.findFirst({
    where: { id: targetId, hidden: false },
    select: {
      id: true,
      name: true,
      ageRange: true,
      photoUrl: true,
      sportProfiles: {
        where: { optedIntoMatching: true },
        select: {
          sport: true,
          bjj: { select: { belt: true, gym: true, weightClass: true } },
        },
      },
    },
  });
  if (!target) return null;

  const isPartner = await arePartners(viewerId, targetId);

  const sportProfiles = target.sportProfiles.filter((sp) => {
    if (isPartner) return true;
    if (!limitToSports) return true;
    return limitToSports.includes(sp.sport);
  });

  return {
    id: target.id,
    name: target.name,
    ageRange: target.ageRange,
    photoUrl: target.photoUrl,
    sportProfiles,
    isPartner,
  };
}
