"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { prisma } from "../db";
import { str, type FormState } from "../form";
import { geocodeZip, isValidZip } from "../geocode";
import { requireProfile } from "../session";
import { parseSport } from "../sports";

type ParsedEventFields = {
  fieldErrors: Record<string, string>;
  values: {
    sport: ReturnType<typeof parseSport>;
    name: string;
    description: string;
    locationText: string;
    zipCode: string;
    date: Date | null;
    startTime: string;
    expectedSize: string;
    rsvpUrl: string;
    /** Set when Places Autocomplete already resolved coordinates. */
    resolvedLat: number | null;
    resolvedLng: number | null;
  };
};

/** Shared validation for the event form fields (create + edit). */
function readEventFields(form: FormData): ParsedEventFields {
  const sport = parseSport(str(form, "sport"));
  const name = str(form, "name");
  const description = str(form, "description");
  const locationText = str(form, "locationText");
  const zipCode = str(form, "zipCode");
  const eventDate = str(form, "eventDate");
  const startTime = str(form, "startTime");
  const expectedSize = str(form, "expectedSize");
  const rsvpUrl = str(form, "rsvpUrl");
  const latRaw = str(form, "lat");
  const lngRaw = str(form, "lng");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Give the event a name.";
  if (!locationText) fieldErrors.locationText = "Where is it?";
  // Places Autocomplete may resolve coordinates without a US zip (e.g. a named
  // venue) — only require a well-formed zip when we don't already have coords.
  const resolvedLat = latRaw ? Number.parseFloat(latRaw) : null;
  const resolvedLng = lngRaw ? Number.parseFloat(lngRaw) : null;
  const hasResolvedCoords =
    resolvedLat !== null && resolvedLng !== null && !Number.isNaN(resolvedLat) && !Number.isNaN(resolvedLng);
  if (!hasResolvedCoords && !isValidZip(zipCode)) {
    fieldErrors.zipCode = "Enter a 5-digit US zip code.";
  }
  if (!eventDate) fieldErrors.eventDate = "Pick a date.";
  if (!startTime) fieldErrors.startTime = "Pick a start time.";

  // Any external link is fine — Partiful, Luma, Eventbrite, a plain URL.
  if (rsvpUrl) {
    try {
      const parsed = new URL(rsvpUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        fieldErrors.rsvpUrl = "Use a link starting with http:// or https://";
      }
    } catch {
      fieldErrors.rsvpUrl = "That doesn't look like a valid link.";
    }
  }

  const date = eventDate ? new Date(`${eventDate}T00:00:00Z`) : null;
  if (eventDate && (!date || Number.isNaN(date.getTime()))) {
    fieldErrors.eventDate = "That date isn't valid.";
  }

  if (!fieldErrors.eventDate && !fieldErrors.startTime && eventDate && startTime) {
    const dateTime = new Date(`${eventDate}T${startTime}:00Z`);
    if (!Number.isNaN(dateTime.getTime()) && dateTime.getTime() < Date.now()) {
      fieldErrors.eventDate = "Events can't be scheduled in the past.";
    }
  }

  return {
    fieldErrors,
    values: {
      sport,
      name,
      description,
      locationText,
      zipCode,
      date,
      startTime,
      expectedSize,
      rsvpUrl,
      resolvedLat: hasResolvedCoords ? resolvedLat : null,
      resolvedLng: hasResolvedCoords ? resolvedLng : null,
    },
  };
}

export async function createEventAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();

  const { fieldErrors, values } = readEventFields(form);
  if (!values.sport) return { error: "Unknown sport." };
  if (!values.date || Object.keys(fieldErrors).length > 0) return { fieldErrors };

  let point = { lat: values.resolvedLat, lng: values.resolvedLng };
  if (point.lat === null || point.lng === null) {
    const geocoded = await geocodeZip(values.zipCode);
    if (!geocoded) {
      return {
        fieldErrors: { zipCode: "We couldn't find that zip code. Check it and retry." },
      };
    }
    point = geocoded;
  }

  await prisma.event.create({
    data: {
      sport: values.sport,
      name: values.name,
      description: values.description || null,
      locationText: values.locationText,
      zipCode: values.zipCode,
      lat: point.lat!,
      lng: point.lng!,
      eventDate: values.date,
      startTime: values.startTime,
      expectedSize: values.expectedSize || null,
      rsvpUrl: values.rsvpUrl || null,
      createdByProfileId: profile.id,
    },
  });

  revalidatePath(`/sports/${values.sport}`);
  redirect(`/sports/${values.sport}`);
}

/**
 * Only the member who submitted an event can edit it. Admin-curated events
 * (createdByProfileId is null) are never user-editable, enforced here —
 * not just hidden in the UI.
 */
export async function updateEventAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();
  const eventId = str(form, "eventId");

  const existing = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, sport: true, createdByProfileId: true },
  });
  if (!existing) notFound();
  if (existing.createdByProfileId !== profile.id) {
    return { error: "You can only edit events you created." };
  }

  const { fieldErrors, values } = readEventFields(form);
  if (!values.date || Object.keys(fieldErrors).length > 0) return { fieldErrors };

  let point = { lat: values.resolvedLat, lng: values.resolvedLng };
  if (point.lat === null || point.lng === null) {
    const geocoded = await geocodeZip(values.zipCode);
    if (!geocoded) {
      return {
        fieldErrors: { zipCode: "We couldn't find that zip code. Check it and retry." },
      };
    }
    point = geocoded;
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      name: values.name,
      description: values.description || null,
      locationText: values.locationText,
      zipCode: values.zipCode,
      lat: point.lat!,
      lng: point.lng!,
      eventDate: values.date,
      startTime: values.startTime,
      expectedSize: values.expectedSize || null,
      rsvpUrl: values.rsvpUrl || null,
    },
  });

  revalidatePath(`/sports/${existing.sport}`);
  revalidatePath(`/events/${eventId}`);
  redirect(`/events/${eventId}`);
}

export async function requestSportAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();
  const requestedSportName = str(form, "sportName");

  if (!requestedSportName) {
    return { fieldErrors: { sportName: "Tell us which sport you want." } };
  }

  await prisma.sportRequest.create({
    data: { requestedSportName, requesterProfileId: profile.id },
  });

  return { success: true };
}
