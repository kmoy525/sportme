import type { Sport } from "@/generated/prisma/enums";

export const SPORTS = ["bjj", "running", "tennis", "lifting"] as const;

export type SportSlug = (typeof SPORTS)[number];

type SportMeta = {
  /** Display name used everywhere in UI copy. */
  label: string;
  /** Lowercase form for mid-sentence copy: "find a partner for jiu-jitsu?" */
  lowerLabel: string;
  /** Sport-specific phrase for the match celebration. */
  matchPhrase: string;
  /** Whether "Find a Partner" is built for this sport yet (MVP: jiu-jitsu only). */
  matchingEnabled: boolean;
  /** Extra strings the homepage search should match on. */
  searchTerms: string[];
};

export const SPORT_META: Record<SportSlug, SportMeta> = {
  bjj: {
    label: "Jiu-Jitsu",
    lowerLabel: "jiu-jitsu",
    matchPhrase: "Let's roll",
    matchingEnabled: true,
    searchTerms: [
      "bjj",
      "jiu-jitsu",
      "jiu jitsu",
      "jiujitsu",
      "brazilian jiu-jitsu",
      "brazilian jiu jitsu",
      "grappling",
      "gi",
      "nogi",
      "no-gi",
      "rolling",
    ],
  },
  running: {
    label: "Running",
    lowerLabel: "running",
    matchPhrase: "Let's run",
    matchingEnabled: false,
    searchTerms: ["run", "running", "jog", "jogging", "5k", "10k", "marathon", "track"],
  },
  tennis: {
    label: "Tennis",
    lowerLabel: "tennis",
    matchPhrase: "Let's play",
    matchingEnabled: false,
    searchTerms: ["tennis", "singles", "doubles", "racquet", "racket"],
  },
  lifting: {
    label: "Lifting",
    lowerLabel: "lifting",
    matchPhrase: "Let's lift",
    matchingEnabled: false,
    searchTerms: [
      "lift",
      "lifting",
      "weights",
      "weightlifting",
      "powerlifting",
      "gym",
      "strength",
    ],
  },
};

export function isSportSlug(value: string): value is SportSlug {
  return (SPORTS as readonly string[]).includes(value);
}

/** Narrow a route param to a Sport enum value, or null. */
export function parseSport(value: string | undefined): Sport | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  return isSportSlug(normalized) ? (normalized as Sport) : null;
}

/**
 * Homepage search. Returns the matching sport, or null so the caller can show
 * the "we don't have that sport yet" empty state.
 */
export function searchSports(query: string): SportSlug | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  for (const slug of SPORTS) {
    const meta = SPORT_META[slug];
    const haystack = [slug, meta.label.toLowerCase(), ...meta.searchTerms];
    if (haystack.some((term) => term === q || term.startsWith(q) || q.startsWith(term))) {
      return slug;
    }
  }
  return null;
}

export function sportLabel(sport: Sport): string {
  return SPORT_META[sport as SportSlug].label;
}

export function matchPhrase(sport: Sport): string {
  return SPORT_META[sport as SportSlug].matchPhrase;
}
