"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { isBelt, isWeightClass } from "../enums";
import { str, type FormState } from "../form";
import { requireProfile } from "../session";
import { parseSport } from "../sports";

/**
 * Opt into matching for jiu-jitsu, capturing its sport-specific fields.
 * The only sport with sport-specific fields — see optInGenericSportAction
 * for every other sport.
 */
export async function optInSportAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();

  const sport = parseSport(str(form, "sport"));
  if (sport !== "bjj") return { error: "Unknown sport." };

  const beltRaw = str(form, "belt");
  const gym = str(form, "gym");
  const weightClassRaw = str(form, "weightClass");

  const fieldErrors: Record<string, string> = {};
  const belt = isBelt(beltRaw) ? beltRaw : null;
  if (!belt) fieldErrors.belt = "Pick your belt.";
  const weightClass = weightClassRaw
    ? isWeightClass(weightClassRaw)
      ? weightClassRaw
      : null
    : null;
  if (weightClassRaw && !weightClass) fieldErrors.weightClass = "Pick a weight class.";
  if (!belt || Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const sportProfile = await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport } },
    update: { optedIntoMatching: true },
    create: { profileId: profile.id, sport, optedIntoMatching: true },
    select: { id: true },
  });

  await prisma.sportProfileBjj.upsert({
    where: { sportProfileId: sportProfile.id },
    update: { belt, gym: gym || null, weightClass },
    create: { sportProfileId: sportProfile.id, belt, gym: gym || null, weightClass },
  });

  revalidatePath(`/sports/${sport}`);
  revalidatePath("/profile");
  redirect(`/sports/${sport}`);
}

/**
 * Opt into matching for sports with no sport-specific fields (running,
 * tennis, lifting) — just flips optedIntoMatching on, nothing else to fill in.
 */
export async function optInGenericSportAction(form: FormData) {
  const { profile } = await requireProfile();
  const sport = parseSport(str(form, "sport"));
  if (!sport || sport === "bjj") return;

  await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport } },
    update: { optedIntoMatching: true },
    create: { profileId: profile.id, sport, optedIntoMatching: true },
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

/** Join a sport without opting into matching. */
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
