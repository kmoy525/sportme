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
  /** Sport-specific phrase for the invite-a-friend SMS/WhatsApp message. */
  smsPhrase: string;
  /** Whether "Find a Partner" is built for this sport yet (MVP: jiu-jitsu only). */
  matchingEnabled: boolean;
  /**
   * One real photo per sport (Unsplash), reused across the landing page, the
   * homepage sport card, and the sport page header.
   */
  imageUrl: string;
  /** Sample text shown as the opt-in description field's placeholder. */
  descriptionPlaceholder: string;
  /** Sample text shown as the event form's name field placeholder. */
  eventNamePlaceholder: string;
  /** Sample text shown as the event form's description field placeholder. */
  eventDescriptionPlaceholder: string;
  /** Extra strings the homepage search should match on. */
  searchTerms: string[];
};

export const SPORT_META: Record<SportSlug, SportMeta> = {
  bjj: {
    label: "Jiu-Jitsu",
    lowerLabel: "jiu-jitsu",
    matchPhrase: "Let's roll",
    smsPhrase: "roll with",
    matchingEnabled: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585537884613-1a9bcd024983?auto=format&fit=crop&w=1200&q=80",
    descriptionPlaceholder:
      "Just moved to US and want to find people to do bjj with. LMK if you're interested!",
    eventNamePlaceholder: "Sunday open mat",
    eventDescriptionPlaceholder: "Casual rolling, all levels. Bring a gi or come no-gi…",
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
    smsPhrase: "run with",
    matchingEnabled: true,
    imageUrl:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=80",
    descriptionPlaceholder:
      "Looking for a running buddy! Training for my first 5K and would like someone to chat with as we train.",
    eventNamePlaceholder: "Saturday morning group run",
    eventDescriptionPlaceholder:
      "Easy-paced group run, all paces welcome. Meet at the trailhead.",
    searchTerms: ["run", "running", "jog", "jogging", "5k", "10k", "marathon", "track"],
  },
  tennis: {
    label: "Tennis",
    lowerLabel: "tennis",
    matchPhrase: "Let's play",
    smsPhrase: "play tennis with",
    matchingEnabled: true,
    imageUrl:
      "https://images.unsplash.com/photo-1548920168-70d61248a912?auto=format&fit=crop&w=1200&q=80",
    descriptionPlaceholder:
      "Looking to start playing tennis again. Played in high school and want a buddy to get me back into it.",
    eventNamePlaceholder: "Weeknight hitting session",
    eventDescriptionPlaceholder:
      "Casual hitting session, singles or doubles. All levels welcome.",
    searchTerms: ["tennis", "singles", "doubles", "racquet", "racket"],
  },
  lifting: {
    label: "Lifting",
    lowerLabel: "lifting",
    matchPhrase: "Let's lift",
    smsPhrase: "find people to lift with",
    matchingEnabled: true,
    imageUrl:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80",
    descriptionPlaceholder:
      "Let's lift together! I just finished personal training sessions in India and would like to help someone train.",
    eventNamePlaceholder: "Tuesday lifting session",
    eventDescriptionPlaceholder:
      "Group lifting session at the gym, spotters welcome. All levels.",
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
