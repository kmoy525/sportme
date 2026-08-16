"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { optInSportAction } from "@/lib/actions/sport-actions";
import { BELT_OPTIONS } from "@/lib/enums";
import { emptyFormState, fieldError } from "@/lib/form";

export type BjjDefaults = {
  belt?: string;
  gym?: string | null;
  weight?: number | null;
  heightIn?: number | null;
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

  const feet = defaults.heightIn ? Math.floor(defaults.heightIn / 12) : undefined;
  const inches = defaults.heightIn ? defaults.heightIn % 12 : undefined;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="sport" value={sport} />
      <FormError>{state.error}</FormError>

      <Field label="Belt" error={fieldError(state, "belt")}>
        <div className="grid grid-cols-5 gap-2">
          {BELT_OPTIONS.map((belt) => (
            <label
              key={belt.value}
              className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-turf/20 bg-white py-2.5 text-center transition-colors has-[:checked]:border-cone has-[:checked]:bg-cone/5"
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
                className="h-5 w-5 rounded-sm border border-ink/25"
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

      <Field label="Weight" hint="Optional." error={fieldError(state, "weight")}>
        <div className="flex items-center gap-2">
          <input
            name="weight"
            type="number"
            inputMode="numeric"
            min={60}
            max={600}
            defaultValue={defaults.weight ?? ""}
            className={inputClass}
          />
          <span className="stat text-xs uppercase tracking-[0.1em] text-ink/50">lb</span>
        </div>
      </Field>

      <Field label="Height" hint="Optional." error={fieldError(state, "height")}>
        <div className="flex items-center gap-2">
          <input
            name="heightFeet"
            type="number"
            inputMode="numeric"
            min={3}
            max={8}
            defaultValue={feet ?? ""}
            aria-label="Height, feet"
            className={inputClass}
          />
          <span className="stat text-xs uppercase tracking-[0.1em] text-ink/50">ft</span>
          <input
            name="heightInches"
            type="number"
            inputMode="numeric"
            min={0}
            max={11}
            defaultValue={inches ?? ""}
            aria-label="Height, inches"
            className={inputClass}
          />
          <span className="stat text-xs uppercase tracking-[0.1em] text-ink/50">in</span>
        </div>
      </Field>

      <SubmitButton size="lg" pendingLabel="Saving…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
