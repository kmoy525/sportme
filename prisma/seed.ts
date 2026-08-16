/**
 * Seed data for local development: a handful of curated events per sport, plus
 * a few jiu-jitsu profiles near a sample zip so the thumbs deck has something
 * to show without signing up ten accounts by hand.
 *
 * Run with: npm run db:seed
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Seattle-ish coordinates so a real zip's geocode lands nearby.
const HUB = { zip: "98101", lat: 47.6101, lng: -122.3344 };

function nearby(offsetMiles: number) {
  const degrees = offsetMiles / 69;
  return { lat: HUB.lat + degrees, lng: HUB.lng + degrees * 0.6 };
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function seedAccount(opts: {
  email: string;
  name: string;
  ageRange: "age_18_24" | "age_25_34" | "age_35_44" | "age_45_54" | "age_55_plus";
  offsetMiles: number;
  belt: "white" | "blue" | "purple" | "brown" | "black";
  gym: string;
  weightClass:
    | "rooster"
    | "light_feather"
    | "feather"
    | "light"
    | "middle"
    | "medium_heavy"
    | "heavy"
    | "super_heavy"
    | "ultra_heavy";
}) {
  const point = nearby(opts.offsetMiles);

  const account = await prisma.account.upsert({
    where: { email: opts.email },
    update: {},
    create: {
      email: opts.email,
      authProvider: "credentials",
      passwordHash: await bcrypt.hash("password123", 10),
      ageConfirmed: true,
      tosAcceptedAt: new Date(),
    },
  });

  const profile = await prisma.profile.upsert({
    where: { accountId: account.id },
    update: {},
    create: {
      accountId: account.id,
      name: opts.name,
      ageRange: opts.ageRange,
      zipCode: HUB.zip,
      lat: point.lat,
      lng: point.lng,
      travelRadiusMiles: 25,
    },
  });

  const sportProfile = await prisma.sportProfile.upsert({
    where: { profileId_sport: { profileId: profile.id, sport: "bjj" } },
    update: { optedIntoMatching: true },
    create: { profileId: profile.id, sport: "bjj", optedIntoMatching: true },
  });

  await prisma.sportProfileBjj.upsert({
    where: { sportProfileId: sportProfile.id },
    update: {},
    create: {
      sportProfileId: sportProfile.id,
      belt: opts.belt,
      gym: opts.gym,
      weightClass: opts.weightClass,
    },
  });

  return profile;
}

async function main() {
  console.log("Seeding demo BJJ profiles…");
  await seedAccount({
    email: "demo-alex@sportme.test",
    name: "Alex Rivera",
    ageRange: "age_25_34",
    offsetMiles: 2,
    belt: "blue",
    gym: "Gracie Barra Downtown",
    weightClass: "middle",
  });
  await seedAccount({
    email: "demo-sam@sportme.test",
    name: "Sam Okafor",
    ageRange: "age_35_44",
    offsetMiles: 6,
    belt: "purple",
    gym: "10th Planet",
    weightClass: "medium_heavy",
  });
  await seedAccount({
    email: "demo-jordan@sportme.test",
    name: "Jordan Lee",
    ageRange: "age_18_24",
    offsetMiles: 12,
    belt: "white",
    gym: "N/A",
    weightClass: "light",
  });

  console.log("Seeding curated events…");
  const events: Array<{
    sport: "bjj" | "running" | "tennis" | "lifting";
    name: string;
    description: string;
    locationText: string;
    dayOffset: number;
    startTime: string;
    expectedSize: string;
    rsvpUrl: string;
  }> = [
    {
      sport: "bjj",
      name: "Sunday Open Mat",
      description: "Casual rolling for all levels. Bring a gi or come no-gi — mats open at 10.",
      locationText: "Gracie Barra Downtown",
      dayOffset: 3,
      startTime: "10:00",
      expectedSize: "20-30",
      rsvpUrl: "https://partiful.com/e/example-open-mat",
    },
    {
      sport: "bjj",
      name: "No-Gi Fundamentals",
      description: "A structured class on takedowns and guard passing before open rolling.",
      locationText: "10th Planet",
      dayOffset: 5,
      startTime: "18:30",
      expectedSize: "10-15",
      rsvpUrl: "https://lu.ma/example-nogi",
    },
    {
      sport: "running",
      name: "Sunrise 5K Group Run",
      description: "Easy-pace loop around the lake, regroup at the halfway point. All paces welcome.",
      locationText: "Green Lake Park",
      dayOffset: 2,
      startTime: "06:30",
      expectedSize: "15-25",
      rsvpUrl: "https://www.strava.com/clubs/example",
    },
    {
      sport: "tennis",
      name: "Doubles Meetup",
      description: "Rotating doubles, all levels. Bring a racquet — a few loaners available.",
      locationText: "Volunteer Park Courts",
      dayOffset: 4,
      startTime: "17:00",
      expectedSize: "8-12",
      rsvpUrl: "https://www.eventbrite.com/e/example-doubles",
    },
    {
      sport: "lifting",
      name: "Saturday Strength Session",
      description: "Small-group strength session. Programming provided, scale to your level.",
      locationText: "Iron Yard Gym",
      dayOffset: 6,
      startTime: "09:00",
      expectedSize: "6-10",
      rsvpUrl: "https://partiful.com/e/example-lifting",
    },
  ];

  for (const e of events) {
    const existing = await prisma.event.findFirst({
      where: { sport: e.sport, name: e.name, createdByProfileId: null },
    });
    if (existing) continue;

    await prisma.event.create({
      data: {
        sport: e.sport,
        name: e.name,
        description: e.description,
        locationText: e.locationText,
        zipCode: HUB.zip,
        lat: HUB.lat,
        lng: HUB.lng,
        eventDate: daysFromNow(e.dayOffset),
        startTime: e.startTime,
        expectedSize: e.expectedSize,
        rsvpUrl: e.rsvpUrl,
        createdByProfileId: null, // admin-curated
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
