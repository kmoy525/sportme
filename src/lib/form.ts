export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Set by actions that stay on the page and need to confirm success. */
  success?: boolean;
};

export const emptyFormState: FormState = {};

export function fieldError(state: FormState | undefined, name: string) {
  return state?.fieldErrors?.[name];
}

/** Trimmed string from FormData, or "" */
export function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function bool(form: FormData, key: string): boolean {
  return form.get(key) === "on" || form.get(key) === "true";
}

export function int(form: FormData, key: string): number | null {
  const raw = str(form, key);
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}
