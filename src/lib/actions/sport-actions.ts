"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { isBelt } from "../enums";
import { int, str, type FormState } from "../form";
import { requireProfile } from "../session";
import { parseSport, SPORT_META, type SportSlug } from "../sports";

/**
 * Opt into matching for a sport, capturing its sport-specific fields.
 * Jiu-jitsu is the only sport with sport-specific fields in MVP.
 */
export async function optInSportAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();

  const sport = parseSport(str(form, "sport"));
  if (!sport) return { error: "Unknown sport." };
  if (!SPORT_META[sport as SportSlug].matchingEnabled) {
    return { error: "Finding a partner isn't available for this sport yet." };
  }

  const beltRaw = str(form, "belt");
  const gym = str(form, "gym");
  const weight = int(form, "weight");
  const heightFeet = int(form, "heightFeet");
  const heightInches = int(form, "heightInches");

  const fieldErrors: Record<string, string> = {};
  const belt = isBelt(beltRaw) ? beltRaw : null;
  if (!belt) fieldErrors.belt = "Pick your belt.";
  if (weight !== null && (weight < 60 || weight > 600)) {
    fieldErrors.weight = "Enter a weight between 60 and 600 lb.";
  }
  if (heightFeet !== null && (heightFeet < 3 || heightFeet > 8)) {
    fieldErrors.height = "Enter a height between 3 and 8 feet.";
  }
  if (heightInches !== null && (heightInches < 0 || heightInches > 11)) {
    fieldErrors.height = "Inches must be between 0 and 11.";
  }
  if (!belt || Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const heightIn =
    heightFeet === null ? null : heightFeet * 12 + (heightInches ?? 0);

  const sportProfile = await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport } },
    update: { optedIntoMatching: true },
    create: { profileId: profile.id, sport, optedIntoMatching: true },
    select: { id: true },
  });

  await prisma.sportProfileBjj.upsert({
    where: { sportProfileId: sportProfile.id },
    update: { belt, gym: gym || null, weight, heightIn },
    create: { sportProfileId: sportProfile.id, belt, gym: gym || null, weight, heightIn },
  });

  revalidatePath(`/sports/${sport}`);
  revalidatePath("/profile");
  redirect(`/sports/${sport}`);
}

/** Opting out hides the user from the deck; it does not delete their data. */
export async function setMatchingOptInAction(form: FormData) {
  const { profile } = await requireProfile();
  const sport = parseSport(str(form, "sport"));
  if (!sport) return;

  const optedIn = str(form, "optedIn") === "true";

  await prisma.sportProfile.updateMany({
    where: { profileId: profile.id, sport },
    data: { optedIntoMatching: optedIn },
  });

  revalidatePath(`/sports/${sport}`);
  revalidatePath("/profile");
}

/** Join a sport without opting into matching (running/tennis/lifting in MVP). */
export async function joinSportAction(form: FormData) {
  const { profile } = await requireProfile();
  const sport = parseSport(str(form, "sport"));
  if (!sport) return;

  await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport } },
    update: {},
    create: { profileId: profile.id, sport },
  });

  revalidatePath(`/sports/${sport}`);
  revalidatePath("/profile");
}
