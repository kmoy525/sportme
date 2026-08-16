import type { AgeRange, Belt, PreferredContact, ReportReason } from "@/generated/prisma/enums";

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

export const PREFERRED_CONTACT_OPTIONS: { value: PreferredContact; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message" },
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

export function reportReasonLabel(value: string): string {
  return REPORT_REASON_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function isAgeRange(value: string): value is AgeRange {
  return AGE_RANGE_OPTIONS.some((o) => o.value === value);
}

export function isBelt(value: string): value is Belt {
  return BELT_OPTIONS.some((o) => o.value === value);
}

export function isPreferredContact(value: string): value is PreferredContact {
  return PREFERRED_CONTACT_OPTIONS.some((o) => o.value === value);
}

export function isReportReason(value: string): value is ReportReason {
  return REPORT_REASON_OPTIONS.some((o) => o.value === value);
}

/** Height in inches -> 5'11" */
export function formatHeight(heightIn: number | null): string {
  if (!heightIn) return "—";
  return `${Math.floor(heightIn / 12)}'${heightIn % 12}"`;
}

export function formatWeight(weight: number | null): string {
  return weight ? `${weight} lb` : "—";
}
