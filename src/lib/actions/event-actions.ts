"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { str, type FormState } from "../form";
import { geocodeZip, isValidZip } from "../geocode";
import { requireProfile } from "../session";
import { parseSport } from "../sports";

export async function createEventAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();

  const sport = parseSport(str(form, "sport"));
  const name = str(form, "name");
  const locationText = str(form, "locationText");
  const zipCode = str(form, "zipCode");
  const eventDate = str(form, "eventDate");
  const startTime = str(form, "startTime");
  const expectedSize = str(form, "expectedSize");
  const rsvpUrl = str(form, "rsvpUrl");

  const fieldErrors: Record<string, string> = {};
  if (!sport) return { error: "Unknown sport." };
  if (!name) fieldErrors.name = "Give the event a name.";
  if (!locationText) fieldErrors.locationText = "Where is it?";
  if (!isValidZip(zipCode)) fieldErrors.zipCode = "Enter a 5-digit US zip code.";
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

  if (!date || Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const point = await geocodeZip(zipCode);
  if (!point) {
    return {
      fieldErrors: { zipCode: "We couldn't find that zip code. Check it and retry." },
    };
  }

  await prisma.event.create({
    data: {
      sport,
      name,
      locationText,
      zipCode,
      lat: point.lat,
      lng: point.lng,
      eventDate: date,
      startTime,
      expectedSize: expectedSize || null,
      rsvpUrl: rsvpUrl || null,
      createdByProfileId: profile.id,
    },
  });

  revalidatePath(`/sports/${sport}`);
  redirect(`/sports/${sport}`);
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
