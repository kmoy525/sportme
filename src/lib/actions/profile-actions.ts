"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { isTravelRadius } from "../distance";
import { isAgeRange, isPreferredContact } from "../enums";
import { int, str, type FormState } from "../form";
import { geocodeZip, isValidZip } from "../geocode";
import { fileFrom, uploadProfilePhoto } from "../photo";
import { requireAccount, requireProfile } from "../session";

/** Shared validation for the baseline profile fields (onboarding + edit). */
function readBaseline(form: FormData, fallbackRadius = 25) {
  const name = str(form, "name");
  const ageRangeRaw = str(form, "ageRange");
  const zipCode = str(form, "zipCode");
  const radius = int(form, "travelRadiusMiles") ?? fallbackRadius;
  const contactRaw = str(form, "preferredContact");

  const ageRange = isAgeRange(ageRangeRaw) ? ageRangeRaw : null;
  const preferredContact = isPreferredContact(contactRaw) ? contactRaw : null;

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Tell people what to call you.";
  if (!ageRange) fieldErrors.ageRange = "Pick an age range.";
  if (!isValidZip(zipCode)) fieldErrors.zipCode = "Enter a 5-digit US zip code.";
  if (!isTravelRadius(radius)) fieldErrors.travelRadiusMiles = "Pick a travel radius.";
  if (!preferredContact) {
    fieldErrors.preferredContact = "Pick how you'd like to be contacted.";
  }

  if (!ageRange || !preferredContact || Object.keys(fieldErrors).length > 0) {
    return { ok: false as const, fieldErrors };
  }
  return {
    ok: true as const,
    values: { name, ageRange, zipCode, radius, preferredContact },
  };
}

export async function onboardingAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const account = await requireAccount();
  if (!account.ageConfirmed || !account.tosAcceptedAt) redirect("/signup/confirm");
  if (account.profile) redirect("/");

  const parsed = readBaseline(form);
  if (!parsed.ok) return { fieldErrors: parsed.fieldErrors };
  const { name, ageRange, zipCode, radius, preferredContact } = parsed.values;

  const point = await geocodeZip(zipCode);
  if (!point) {
    return {
      fieldErrors: { zipCode: "We couldn't find that zip code. Check it and retry." },
    };
  }

  const photo = await uploadProfilePhoto(fileFrom(form, "photo"));
  if (!photo.ok) return { fieldErrors: { photo: photo.error } };

  await prisma.profile.create({
    data: {
      accountId: account.id,
      name,
      ageRange,
      photoUrl: photo.url,
      zipCode,
      lat: point.lat,
      lng: point.lng,
      travelRadiusMiles: radius,
      preferredContact,
    },
  });

  redirect("/");
}

export async function updateProfileAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();

  const parsed = readBaseline(form, profile.travelRadiusMiles);
  if (!parsed.ok) return { fieldErrors: parsed.fieldErrors };
  const { name, ageRange, zipCode, radius, preferredContact } = parsed.values;

  // Only re-geocode when the zip actually changed.
  let coords = { lat: profile.lat, lng: profile.lng };
  if (zipCode !== profile.zipCode) {
    const point = await geocodeZip(zipCode);
    if (!point) {
      return {
        fieldErrors: { zipCode: "We couldn't find that zip code. Check it and retry." },
      };
    }
    coords = point;
  }

  const photo = await uploadProfilePhoto(fileFrom(form, "photo"));
  if (!photo.ok) return { fieldErrors: { photo: photo.error } };

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      name,
      ageRange,
      zipCode,
      lat: coords.lat,
      lng: coords.lng,
      travelRadiusMiles: radius,
      preferredContact,
      ...(photo.url ? { photoUrl: photo.url } : {}),
    },
  });

  revalidatePath("/profile");
  return { success: true };
}
