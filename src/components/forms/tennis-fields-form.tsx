"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { optInTennisAction } from "@/lib/actions/sport-actions";
import { NTRP_OPTIONS, TENNIS_PREFERENCE_OPTIONS, TENNIS_STYLE_OPTIONS } from "@/lib/enums";
import { emptyFormState, fieldError } from "@/lib/form";
import { SPORT_META } from "@/lib/sports";

export type TennisDefaults = {
  ntrp?: number | null;
  style?: string | null;
  preference?: string | null;
  description?: string | null;
};

export function TennisFieldsForm({
  defaults = {},
  submitLabel,
}: {
  defaults?: TennisDefaults;
  submitLabel: string;
}) {
  const [state, action] = useActionState(optInTennisAction, emptyFormState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="sport" value="tennis" />
      <FormError>{state.error}</FormError>

      <Field label="NTRP rating" hint="Optional." error={fieldError(state, "ntrp")}>
        <select name="ntrp" defaultValue={defaults.ntrp ?? ""} className={inputClass}>
          <option value="">Prefer not to say</option>
          {NTRP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Style" hint="Optional." error={fieldError(state, "style")}>
        <select name="style" defaultValue={defaults.style ?? ""} className={inputClass}>
          <option value="">Prefer not to say</option>
          {TENNIS_STYLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Singles or doubles" hint="Optional." error={fieldError(state, "preference")}>
        <select name="preference" defaultValue={defaults.preference ?? ""} className={inputClass}>
          <option value="">Prefer not to say</option>
          {TENNIS_PREFERENCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="About you" hint="Optional. Shown on your profile.">
        <textarea
          name="description"
          rows={4}
          maxLength={500}
          defaultValue={defaults.description ?? ""}
          placeholder={SPORT_META.tennis.descriptionPlaceholder}
          className={inputClass}
        />
      </Field>

      <SubmitButton size="lg" pendingLabel="Saving…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
