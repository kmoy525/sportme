import type {
  AgeRange,
  Belt,
  Gender,
  GymMembership,
  LiftingGoal,
  LiftingProgram,
  ReportReason,
  RunningRaceDistance,
  RunningTypicalDistance,
  SessionLength,
  TennisPreference,
  TennisStyle,
  WeightClass,
} from "@/generated/prisma/enums";

export const AGE_RANGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "age_18_24", label: "18-24" },
  { value: "age_25_34", label: "25-34" },
  { value: "age_35_44", label: "35-44" },
  { value: "age_45_54", label: "45-54" },
  { value: "age_55_plus", label: "55+" },
];

/// Optional. No option here corresponds to "blank" — leaving the field
/// unselected means null, distinct from choosing "Prefer not to say".
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const BELT_OPTIONS: { value: Belt; label: string; swatch: string }[] = [
  { value: "white", label: "White", swatch: "#f2f0e8" },
  { value: "blue", label: "Blue", swatch: "#2456a6" },
  { value: "purple", label: "Purple", swatch: "#6b3fa0" },
  { value: "brown", label: "Brown", swatch: "#6b4429" },
  { value: "black", label: "Black", swatch: "#141414" },
];

/// Standard BJJ weight classes, rooster to ultra heavy.
export const WEIGHT_CLASS_OPTIONS: { value: WeightClass; label: string }[] = [
  { value: "rooster", label: "Rooster" },
  { value: "light_feather", label: "Light Feather" },
  { value: "feather", label: "Feather" },
  { value: "light", label: "Light" },
  { value: "middle", label: "Middle" },
  { value: "medium_heavy", label: "Medium Heavy" },
  { value: "heavy", label: "Heavy" },
  { value: "super_heavy", label: "Super Heavy" },
  { value: "ultra_heavy", label: "Ultra Heavy" },
];

export const RUNNING_RACE_DISTANCE_OPTIONS: { value: RunningRaceDistance; label: string }[] = [
  { value: "five_k", label: "5K" },
  { value: "ten_k", label: "10K" },
  { value: "half_marathon", label: "Half Marathon" },
  { value: "marathon", label: "Marathon" },
  { value: "ultra_marathon", label: "Ultra Marathon" },
];

export const RUNNING_TYPICAL_DISTANCE_OPTIONS: {
  value: RunningTypicalDistance;
  label: string;
}[] = [
  { value: "one_mile", label: "1 mile" },
  { value: "five_k", label: "5K" },
  { value: "ten_k", label: "10K" },
  { value: "ten_miles_plus", label: "10 miles+" },
];

export const TENNIS_STYLE_OPTIONS: { value: TennisStyle; label: string }[] = [
  { value: "competitive", label: "Competitive" },
  { value: "social", label: "Social" },
];

export const TENNIS_PREFERENCE_OPTIONS: { value: TennisPreference; label: string }[] = [
  { value: "singles", label: "Singles" },
  { value: "doubles", label: "Doubles" },
  { value: "both", label: "Both" },
];

export const LIFTING_PROGRAM_OPTIONS: { value: LiftingProgram; label: string }[] = [
  { value: "general_strength", label: "General strength" },
  { value: "powerlifting", label: "Powerlifting" },
  { value: "bodybuilding", label: "Bodybuilding" },
  { value: "calisthenics", label: "Calisthenics" },
  { value: "crossfit", label: "CrossFit" },
];

export const LIFTING_GOAL_OPTIONS: { value: LiftingGoal; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "fat_loss", label: "Fat loss" },
  { value: "competition_prep", label: "Competition prep" },
  { value: "general_fitness", label: "General fitness" },
];

export const SESSION_LENGTH_OPTIONS: { value: SessionLength; label: string }[] = [
  { value: "min_20", label: "20 min" },
  { value: "min_30", label: "30 min" },
  { value: "min_45", label: "45 min" },
  { value: "hr_1", label: "1 hr" },
  { value: "hr_1_5", label: "1.5 hr" },
  { value: "hr_2_plus", label: "2 hr+" },
];

export const GYM_MEMBERSHIP_OPTIONS: { value: GymMembership; label: string }[] = [
  { value: "twenty_four_hour_fitness", label: "24 Hour Fitness" },
  { value: "planet_fitness", label: "Planet Fitness" },
  { value: "ymca", label: "YMCA" },
  { value: "healthworks", label: "Healthworks" },
  { value: "equinox", label: "Equinox" },
  { value: "lifetime", label: "Lifetime" },
  { value: "other", label: "Other" },
];

export const REPORT_REASON_OPTIONS: { value: ReportReason; label: string }[] = [
  { value: "fake_profile", label: "Fake profile" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate_photo", label: "Inappropriate photo" },
  { value: "other", label: "Other" },
];

export function ageRangeLabel(value: string): string {
  return AGE_RANGE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function beltLabel(value: string): string {
  return BELT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function beltSwatch(value: string): string {
  return BELT_OPTIONS.find((o) => o.value === value)?.swatch ?? "#141414";
}

export function weightClassLabel(value: string | null): string {
  if (!value) return "—";
  return WEIGHT_CLASS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function runningRaceDistanceLabel(value: string | null): string {
  if (!value) return "—";
  return RUNNING_RACE_DISTANCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function runningTypicalDistanceLabel(value: string | null): string {
  if (!value) return "—";
  return RUNNING_TYPICAL_DISTANCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function tennisStyleLabel(value: string | null): string {
  if (!value) return "—";
  return TENNIS_STYLE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function tennisPreferenceLabel(value: string | null): string {
  if (!value) return "—";
  return TENNIS_PREFERENCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function liftingProgramLabel(value: string | null): string {
  if (!value) return "—";
  return LIFTING_PROGRAM_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function liftingGoalLabel(value: string | null): string {
  if (!value) return "—";
  return LIFTING_GOAL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function sessionLengthLabel(value: string | null): string {
  if (!value) return "—";
  return SESSION_LENGTH_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function gymMembershipLabel(value: string | null): string {
  if (!value) return "—";
  return GYM_MEMBERSHIP_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function reportReasonLabel(value: string): string {
  return REPORT_REASON_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function isAgeRange(value: string): value is AgeRange {
  return AGE_RANGE_OPTIONS.some((o) => o.value === value);
}

export function genderLabel(value: string | null): string {
  if (!value) return "—";
  return GENDER_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function isGender(value: string): value is Gender {
  return GENDER_OPTIONS.some((o) => o.value === value);
}

export function isBelt(value: string): value is Belt {
  return BELT_OPTIONS.some((o) => o.value === value);
}

export function isWeightClass(value: string): value is WeightClass {
  return WEIGHT_CLASS_OPTIONS.some((o) => o.value === value);
}

export function isRunningRaceDistance(value: string): value is RunningRaceDistance {
  return RUNNING_RACE_DISTANCE_OPTIONS.some((o) => o.value === value);
}

export function isRunningTypicalDistance(value: string): value is RunningTypicalDistance {
  return RUNNING_TYPICAL_DISTANCE_OPTIONS.some((o) => o.value === value);
}

export function isTennisStyle(value: string): value is TennisStyle {
  return TENNIS_STYLE_OPTIONS.some((o) => o.value === value);
}

export function isTennisPreference(value: string): value is TennisPreference {
  return TENNIS_PREFERENCE_OPTIONS.some((o) => o.value === value);
}

export function isLiftingProgram(value: string): value is LiftingProgram {
  return LIFTING_PROGRAM_OPTIONS.some((o) => o.value === value);
}

export function isLiftingGoal(value: string): value is LiftingGoal {
  return LIFTING_GOAL_OPTIONS.some((o) => o.value === value);
}

export function isSessionLength(value: string): value is SessionLength {
  return SESSION_LENGTH_OPTIONS.some((o) => o.value === value);
}

export function isGymMembership(value: string): value is GymMembership {
  return GYM_MEMBERSHIP_OPTIONS.some((o) => o.value === value);
}

export function isReportReason(value: string): value is ReportReason {
  return REPORT_REASON_OPTIONS.some((o) => o.value === value);
}

const PACE_MIN_SECONDS = 4 * 60; // 4:00/mi
const PACE_MAX_SECONDS = 12 * 60; // 12:00/mi
const PACE_STEP_SECONDS = 30;

/** 4:00/mi to 12:00/mi in 30-second steps. */
export const PACE_OPTIONS: { value: number; label: string }[] = Array.from(
  { length: (PACE_MAX_SECONDS - PACE_MIN_SECONDS) / PACE_STEP_SECONDS + 1 },
  (_, i) => {
    const seconds = PACE_MIN_SECONDS + i * PACE_STEP_SECONDS;
    return { value: seconds, label: paceLabel(seconds) };
  },
);

export function paceLabel(secondsPerMile: number | null): string {
  if (!secondsPerMile) return "—";
  const minutes = Math.floor(secondsPerMile / 60);
  const seconds = secondsPerMile % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}/mi`;
}

export function isPaceSeconds(value: number): boolean {
  return (
    value >= PACE_MIN_SECONDS &&
    value <= PACE_MAX_SECONDS &&
    value % PACE_STEP_SECONDS === 0
  );
}

/** NTRP ratings run 1.0-7.0 in 0.5 steps. */
export const NTRP_OPTIONS: { value: number; label: string }[] = Array.from(
  { length: 13 },
  (_, i) => {
    const value = 1 + i * 0.5;
    return { value, label: value.toFixed(1) };
  },
);

export function ntrpLabel(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return value.toFixed(1);
}

export function isNtrp(value: number): boolean {
  return value >= 1 && value <= 7 && Math.abs(value * 2 - Math.round(value * 2)) < 1e-9;
}
