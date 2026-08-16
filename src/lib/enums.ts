import type { AgeRange, Belt, ReportReason, WeightClass } from "@/generated/prisma/enums";

export const AGE_RANGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: "age_18_24", label: "18-24" },
  { value: "age_25_34", label: "25-34" },
  { value: "age_35_44", label: "35-44" },
  { value: "age_45_54", label: "45-54" },
  { value: "age_55_plus", label: "55+" },
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

export function reportReasonLabel(value: string): string {
  return REPORT_REASON_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function isAgeRange(value: string): value is AgeRange {
  return AGE_RANGE_OPTIONS.some((o) => o.value === value);
}

export function isBelt(value: string): value is Belt {
  return BELT_OPTIONS.some((o) => o.value === value);
}

export function isWeightClass(value: string): value is WeightClass {
  return WEIGHT_CLASS_OPTIONS.some((o) => o.value === value);
}

export function isReportReason(value: string): value is ReportReason {
  return REPORT_REASON_OPTIONS.some((o) => o.value === value);
}
