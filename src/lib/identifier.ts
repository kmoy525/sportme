const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Identifier =
  | { kind: "email"; value: string }
  | { kind: "phone"; value: string };

/**
 * Signup and login both accept "email or phone" in one field. Normalize so the
 * same input always resolves to the same accounts row.
 */
export function normalizeIdentifier(input: string): Identifier | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (EMAIL_RE.test(trimmed)) {
    return { kind: "email", value: trimmed.toLowerCase() };
  }

  const digits = trimmed.replace(/[^\d]/g, "");
  if (digits.length === 10) return { kind: "phone", value: `+1${digits}` };
  if (digits.length === 11 && digits.startsWith("1")) {
    return { kind: "phone", value: `+${digits}` };
  }

  return null;
}

export function formatPhone(e164: string): string {
  const digits = e164.replace(/[^\d]/g, "").slice(-10);
  if (digits.length !== 10) return e164;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
