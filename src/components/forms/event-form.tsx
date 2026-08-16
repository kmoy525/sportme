"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { createEventAction } from "@/lib/actions/event-actions";
import { emptyFormState, fieldError } from "@/lib/form";

export function EventForm({ sport, defaultZip }: { sport: string; defaultZip: string }) {
  const [state, action] = useActionState(createEventAction, emptyFormState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="sport" value={sport} />
      <FormError>{state.error}</FormError>

      <Field label="Event name" error={fieldError(state, "name")}>
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="Sunday open mat"
          className={inputClass}
        />
      </Field>

      <Field label="Location" error={fieldError(state, "locationText")}>
        <input
          name="locationText"
          type="text"
          required
          maxLength={120}
          placeholder="Gracie Barra, 4th & Main"
          className={inputClass}
        />
      </Field>

      <Field label="Zip code" error={fieldError(state, "zipCode")}>
        <input
          name="zipCode"
          type="text"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          required
          defaultValue={defaultZip}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" error={fieldError(state, "eventDate")}>
          <input name="eventDate" type="date" required className={inputClass} />
        </Field>
        <Field label="Start time" error={fieldError(state, "startTime")}>
          <input name="startTime" type="time" required className={inputClass} />
        </Field>
      </div>

      <Field label="Expected size" hint="Optional. Roughly how many people?">
        <input
          name="expectedSize"
          type="text"
          maxLength={30}
          placeholder="10-15"
          className={inputClass}
        />
      </Field>

      <Field
        label="RSVP link"
        hint="Optional. Partiful, Luma, Eventbrite, or any link."
        error={fieldError(state, "rsvpUrl")}
      >
        <input
          name="rsvpUrl"
          type="url"
          inputMode="url"
          placeholder="https://…"
          className={inputClass}
        />
      </Field>

      <SubmitButton size="lg" pendingLabel="Adding…">
        Add event
      </SubmitButton>
    </form>
  );
}
