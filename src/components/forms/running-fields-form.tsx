"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { optInRunningAction } from "@/lib/actions/sport-actions";
import {
  PACE_OPTIONS,
  RUNNING_RACE_DISTANCE_OPTIONS,
  RUNNING_TYPICAL_DISTANCE_OPTIONS,
} from "@/lib/enums";
import { emptyFormState, fieldError } from "@/lib/form";
import { SPORT_META } from "@/lib/sports";

export type RunningDefaults = {
  paceSecondsPerMile?: number | null;
  trainingFor?: string | null;
  typicalDistance?: string | null;
  description?: string | null;
};

export function RunningFieldsForm({
  defaults = {},
  submitLabel,
}: {
  defaults?: RunningDefaults;
  submitLabel: string;
}) {
  const [state, action] = useActionState(optInRunningAction, emptyFormState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="sport" value="running" />
      <FormError>{state.error}</FormError>

      <Field
        label="Preferred pace"
        hint="Optional. Per mile."
        error={fieldError(state, "paceSecondsPerMile")}
      >
        <select
          name="paceSecondsPerMile"
          defaultValue={defaults.paceSecondsPerMile ?? ""}
          className={inputClass}
        >
          <option value="">Prefer not to say</option>
          {PACE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Training for"
        hint="Optional."
        error={fieldError(state, "trainingFor")}
      >
        <select name="trainingFor" defaultValue={defaults.trainingFor ?? ""} className={inputClass}>
          <option value="">Prefer not to say</option>
          {RUNNING_RACE_DISTANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="How far you typically run"
        hint="Optional."
        error={fieldError(state, "typicalDistance")}
      >
        <select
          name="typicalDistance"
          defaultValue={defaults.typicalDistance ?? ""}
          className={inputClass}
        >
          <option value="">Prefer not to say</option>
          {RUNNING_TYPICAL_DISTANCE_OPTIONS.map((o) => (
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
          placeholder={SPORT_META.running.descriptionPlaceholder}
          className={inputClass}
        />
      </Field>

      <SubmitButton size="lg" pendingLabel="Saving…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
