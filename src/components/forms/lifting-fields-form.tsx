"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { optInLiftingAction } from "@/lib/actions/sport-actions";
import {
  GYM_MEMBERSHIP_OPTIONS,
  LIFTING_GOAL_OPTIONS,
  LIFTING_PROGRAM_OPTIONS,
  SESSION_LENGTH_OPTIONS,
} from "@/lib/enums";
import { emptyFormState, fieldError } from "@/lib/form";
import { SPORT_META } from "@/lib/sports";

export type LiftingDefaults = {
  program?: string | null;
  goal?: string | null;
  sessionLength?: string | null;
  gymMembership?: string | null;
  description?: string | null;
};

export function LiftingFieldsForm({
  defaults = {},
  submitLabel,
}: {
  defaults?: LiftingDefaults;
  submitLabel: string;
}) {
  const [state, action] = useActionState(optInLiftingAction, emptyFormState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="sport" value="lifting" />
      <FormError>{state.error}</FormError>

      <Field label="Training program" hint="Optional." error={fieldError(state, "program")}>
        <select name="program" defaultValue={defaults.program ?? ""} className={inputClass}>
          <option value="">Prefer not to say</option>
          {LIFTING_PROGRAM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Goal" hint="Optional." error={fieldError(state, "goal")}>
        <select name="goal" defaultValue={defaults.goal ?? ""} className={inputClass}>
          <option value="">Prefer not to say</option>
          {LIFTING_GOAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Session length"
        hint="Optional."
        error={fieldError(state, "sessionLength")}
      >
        <select
          name="sessionLength"
          defaultValue={defaults.sessionLength ?? ""}
          className={inputClass}
        >
          <option value="">Prefer not to say</option>
          {SESSION_LENGTH_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Gym membership"
        hint="Optional."
        error={fieldError(state, "gymMembership")}
      >
        <select
          name="gymMembership"
          defaultValue={defaults.gymMembership ?? ""}
          className={inputClass}
        >
          <option value="">Prefer not to say</option>
          {GYM_MEMBERSHIP_OPTIONS.map((o) => (
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
          placeholder={SPORT_META.lifting.descriptionPlaceholder}
          className={inputClass}
        />
      </Field>

      <SubmitButton size="lg" pendingLabel="Saving…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
