"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { optInSportAction } from "@/lib/actions/sport-actions";
import { BELT_OPTIONS, WEIGHT_CLASS_OPTIONS } from "@/lib/enums";
import { emptyFormState, fieldError } from "@/lib/form";
import { SPORT_META } from "@/lib/sports";

export type BjjDefaults = {
  belt?: string;
  gym?: string | null;
  weightClass?: string | null;
  description?: string | null;
};

export function BjjFieldsForm({
  sport,
  defaults = {},
  submitLabel,
}: {
  sport: string;
  defaults?: BjjDefaults;
  submitLabel: string;
}) {
  const [state, action] = useActionState(optInSportAction, emptyFormState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="sport" value={sport} />
      <FormError>{state.error}</FormError>

      <Field label="Belt" error={fieldError(state, "belt")}>
        <div className="grid grid-cols-5 gap-2">
          {BELT_OPTIONS.map((belt) => (
            <label
              key={belt.value}
              className="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border border-ink/15 bg-white py-2.5 text-center transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand/5"
            >
              <input
                type="radio"
                name="belt"
                value={belt.value}
                required
                defaultChecked={defaults.belt === belt.value}
                className="sr-only"
              />
              <span
                aria-hidden
                className="h-5 w-5 rounded-full border border-ink/25"
                style={{ background: belt.swatch }}
              />
              <span className="stat text-[9px] font-semibold uppercase tracking-[0.06em] text-ink/70">
                {belt.label}
              </span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Gym" hint="&ldquo;N/A&rdquo; is fine if you train on your own.">
        <input
          name="gym"
          type="text"
          maxLength={80}
          defaultValue={defaults.gym ?? ""}
          placeholder="Where do you train?"
          className={inputClass}
        />
      </Field>

      <Field
        label="Weight class"
        hint="Optional. Standard BJJ weight classes."
        error={fieldError(state, "weightClass")}
      >
        <select
          name="weightClass"
          defaultValue={defaults.weightClass ?? ""}
          className={inputClass}
        >
          <option value="">Prefer not to say</option>
          {WEIGHT_CLASS_OPTIONS.map((o) => (
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
          placeholder={SPORT_META.bjj.descriptionPlaceholder}
          className={inputClass}
        />
      </Field>

      <SubmitButton size="lg" pendingLabel="Saving…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
