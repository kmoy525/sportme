"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { createEventAction, updateEventAction } from "@/lib/actions/event-actions";
import { emptyFormState, fieldError } from "@/lib/form";
import { googleMapsApiKey } from "@/lib/maps";
import { SPORT_META, type SportSlug } from "@/lib/sports";

import { EventDatePicker } from "./event-date-picker";
import { LocationAutocomplete } from "./location-autocomplete";

export type EventDefaults = {
  name?: string;
  description?: string;
  locationText?: string;
  zipCode?: string;
  eventDate?: string;
  startTime?: string;
  expectedSize?: string;
  rsvpUrl?: string;
};

export function EventForm({
  sport,
  defaultZip,
  eventId,
  defaults,
}: {
  sport: string;
  defaultZip: string;
  /** Present in edit mode; omitted when creating a new event. */
  eventId?: string;
  defaults?: EventDefaults;
}) {
  const [state, action] = useActionState(
    eventId ? updateEventAction : createEventAction,
    emptyFormState,
  );
  const apiKey = googleMapsApiKey();
  const meta = SPORT_META[sport as SportSlug];

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const data = new FormData(e.currentTarget);
        const eventDate = data.get("eventDate")?.toString();
        const startTime = data.get("startTime")?.toString();
        if (!eventDate || !startTime) return;

        const when = new Date(`${eventDate}T${startTime}:00`);
        if (!Number.isNaN(when.getTime()) && when.getTime() < Date.now()) {
          e.preventDefault();
          window.alert("Events can't be scheduled in the past.");
        }
      }}
      className="space-y-5"
    >
      <input type="hidden" name="sport" value={sport} />
      {eventId ? <input type="hidden" name="eventId" value={eventId} /> : null}
      <FormError>{state.error}</FormError>

      <Field label="Event name" error={fieldError(state, "name")}>
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={defaults?.name}
          placeholder={meta.eventNamePlaceholder}
          className={inputClass}
        />
      </Field>

      <LocationAutocomplete
        state={state}
        apiKey={apiKey}
        defaultLocationText={defaults?.locationText}
        defaultZipCode={defaults?.zipCode ?? defaultZip}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" error={fieldError(state, "eventDate")}>
          <EventDatePicker name="eventDate" defaultValue={defaults?.eventDate} />
        </Field>
        <Field label="Start time" error={fieldError(state, "startTime")}>
          <input
            name="startTime"
            type="time"
            required
            defaultValue={defaults?.startTime}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Expected size" hint="Optional. Roughly how many people?">
        <input
          name="expectedSize"
          type="text"
          maxLength={30}
          defaultValue={defaults?.expectedSize}
          placeholder="10-15"
          className={inputClass}
        />
      </Field>

      <Field label="Description" hint="Optional. What should people know before showing up?">
        <textarea
          name="description"
          rows={4}
          maxLength={1000}
          defaultValue={defaults?.description}
          placeholder={meta.eventDescriptionPlaceholder}
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
          defaultValue={defaults?.rsvpUrl}
          placeholder="https://…"
          className={inputClass}
        />
      </Field>

      <SubmitButton size="lg" pendingLabel={eventId ? "Saving…" : "Adding…"}>
        {eventId ? "Save changes" : "Add event"}
      </SubmitButton>
    </form>
  );
}
