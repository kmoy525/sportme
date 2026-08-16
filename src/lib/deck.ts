import type { DeckCandidate } from "./matching";

/**
 * What the client is allowed to see about a candidate.
 * Deliberately excludes distance — profiles are ordered by distance
 * server-side, and it is never displayed.
 */
export type DeckProfile = {
  profileId: string;
  name: string;
  ageRange: string;
  photoUrl: string | null;
  bjj: {
    belt: string;
    gym: string | null;
    weightClass: string | null;
  } | null;
};

export function toDeckProfile(candidate: DeckCandidate): DeckProfile {
  return {
    profileId: candidate.profileId,
    name: candidate.name,
    ageRange: candidate.ageRange,
    photoUrl: candidate.photoUrl,
    bjj: candidate.bjj,
  };
}
