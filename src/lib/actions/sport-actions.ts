"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import {
  isBelt,
  isGymMembership,
  isLiftingGoal,
  isLiftingProgram,
  isNtrp,
  isPaceSeconds,
  isRunningRaceDistance,
  isRunningTypicalDistance,
  isSessionLength,
  isTennisPreference,
  isTennisStyle,
  isWeightClass,
} from "../enums";
import { int, str, type FormState } from "../form";
import { requireProfile } from "../session";
import { parseSport } from "../sports";

/** float() mirrors int() from ../form, but for the NTRP field. */
function float(form: FormData, key: string): number | null {
  const raw = str(form, key);
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  return Number.isNaN(n) ? null : n;
}

/** Opt into matching for jiu-jitsu, capturing its sport-specific fields. */
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
  const description = str(form, "description");

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
    update: { optedIntoMatching: true, description: description || null },
    create: {
      profileId: profile.id,
      sport,
      optedIntoMatching: true,
      description: description || null,
    },
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

export async function optInRunningAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();
  if (parseSport(str(form, "sport")) !== "running") return { error: "Unknown sport." };

  const paceRaw = int(form, "paceSecondsPerMile");
  const trainingForRaw = str(form, "trainingFor");
  const typicalDistanceRaw = str(form, "typicalDistance");
  const description = str(form, "description");

  const fieldErrors: Record<string, string> = {};
  const pace = paceRaw !== null && isPaceSeconds(paceRaw) ? paceRaw : null;
  if (paceRaw !== null && !pace) fieldErrors.paceSecondsPerMile = "Pick a pace.";
  const trainingFor = trainingForRaw && isRunningRaceDistance(trainingForRaw) ? trainingForRaw : null;
  if (trainingForRaw && !trainingFor) fieldErrors.trainingFor = "Pick what you're training for.";
  const typicalDistance =
    typicalDistanceRaw && isRunningTypicalDistance(typicalDistanceRaw) ? typicalDistanceRaw : null;
  if (typicalDistanceRaw && !typicalDistance) {
    fieldErrors.typicalDistance = "Pick a typical distance.";
  }
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const sportProfile = await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport: "running" } },
    update: { optedIntoMatching: true, description: description || null },
    create: {
      profileId: profile.id,
      sport: "running",
      optedIntoMatching: true,
      description: description || null,
    },
    select: { id: true },
  });

  await prisma.sportProfileRunning.upsert({
    where: { sportProfileId: sportProfile.id },
    update: { paceSecondsPerMile: pace, trainingFor, typicalDistance },
    create: {
      sportProfileId: sportProfile.id,
      paceSecondsPerMile: pace,
      trainingFor,
      typicalDistance,
    },
  });

  revalidatePath("/sports/running");
  revalidatePath("/profile");
  redirect("/sports/running");
}

export async function optInTennisAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();
  if (parseSport(str(form, "sport")) !== "tennis") return { error: "Unknown sport." };

  const ntrpRaw = float(form, "ntrp");
  const styleRaw = str(form, "style");
  const preferenceRaw = str(form, "preference");
  const description = str(form, "description");

  const fieldErrors: Record<string, string> = {};
  const ntrp = ntrpRaw !== null && isNtrp(ntrpRaw) ? ntrpRaw : null;
  if (ntrpRaw !== null && ntrp === null) fieldErrors.ntrp = "Pick an NTRP rating.";
  const style = styleRaw && isTennisStyle(styleRaw) ? styleRaw : null;
  if (styleRaw && !style) fieldErrors.style = "Pick competitive or social.";
  const preference = preferenceRaw && isTennisPreference(preferenceRaw) ? preferenceRaw : null;
  if (preferenceRaw && !preference) fieldErrors.preference = "Pick a preference.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const sportProfile = await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport: "tennis" } },
    update: { optedIntoMatching: true, description: description || null },
    create: {
      profileId: profile.id,
      sport: "tennis",
      optedIntoMatching: true,
      description: description || null,
    },
    select: { id: true },
  });

  await prisma.sportProfileTennis.upsert({
    where: { sportProfileId: sportProfile.id },
    update: { ntrp, style, preference },
    create: { sportProfileId: sportProfile.id, ntrp, style, preference },
  });

  revalidatePath("/sports/tennis");
  revalidatePath("/profile");
  redirect("/sports/tennis");
}

export async function optInLiftingAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();
  if (parseSport(str(form, "sport")) !== "lifting") return { error: "Unknown sport." };

  const programRaw = str(form, "program");
  const goalRaw = str(form, "goal");
  const sessionLengthRaw = str(form, "sessionLength");
  const gymMembershipRaw = str(form, "gymMembership");
  const description = str(form, "description");

  const fieldErrors: Record<string, string> = {};
  const program = programRaw && isLiftingProgram(programRaw) ? programRaw : null;
  if (programRaw && !program) fieldErrors.program = "Pick a training program.";
  const goal = goalRaw && isLiftingGoal(goalRaw) ? goalRaw : null;
  if (goalRaw && !goal) fieldErrors.goal = "Pick a goal.";
  const sessionLength = sessionLengthRaw && isSessionLength(sessionLengthRaw) ? sessionLengthRaw : null;
  if (sessionLengthRaw && !sessionLength) fieldErrors.sessionLength = "Pick a session length.";
  const gymMembership = gymMembershipRaw && isGymMembership(gymMembershipRaw) ? gymMembershipRaw : null;
  if (gymMembershipRaw && !gymMembership) fieldErrors.gymMembership = "Pick a gym.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const sportProfile = await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport: "lifting" } },
    update: { optedIntoMatching: true, description: description || null },
    create: {
      profileId: profile.id,
      sport: "lifting",
      optedIntoMatching: true,
      description: description || null,
    },
    select: { id: true },
  });

  await prisma.sportProfileLifting.upsert({
    where: { sportProfileId: sportProfile.id },
    update: { program, goal, sessionLength, gymMembership },
    create: { sportProfileId: sportProfile.id, program, goal, sessionLength, gymMembership },
  });

  revalidatePath("/sports/lifting");
  revalidatePath("/profile");
  redirect("/sports/lifting");
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
