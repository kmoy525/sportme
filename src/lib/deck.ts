import type {
  BjjStats,
  DeckCandidate,
  LiftingStats,
  RunningStats,
  TennisStats,
} from "./matching";

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
  description: string | null;
  bjj: BjjStats | null;
  running: RunningStats | null;
  tennis: TennisStats | null;
  lifting: LiftingStats | null;
};

export function toDeckProfile(candidate: DeckCandidate): DeckProfile {
  return {
    profileId: candidate.profileId,
    name: candidate.name,
    ageRange: candidate.ageRange,
    photoUrl: candidate.photoUrl,
    description: candidate.description,
    bjj: candidate.bjj,
    running: candidate.running,
    tennis: candidate.tennis,
    lifting: candidate.lifting,
  };
}
