import Link from "next/link";
import { notFound } from "next/navigation";

import { EventCarousel } from "@/components/event-carousel";
import { InviteFriendLink } from "@/components/invite-friend";
import { PartnerDeck } from "@/components/partner-deck";
import { ButtonLink, Card, SectionHeading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { toDeckProfile } from "@/lib/deck";
import { getCandidates, hasPasses } from "@/lib/matching";
import { requireProfile } from "@/lib/session";
import { inviteMessage } from "@/lib/invite";
import { parseSport, SPORT_META, type SportSlug } from "@/lib/sports";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const sport = parseSport((await params).sport);
  if (!sport) return { title: "SportMe" };
  return { title: `${SPORT_META[sport as SportSlug].label} · SportMe` };
}

export default async function SportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const sport = parseSport((await params).sport);
  if (!sport) notFound();

  const meta = SPORT_META[sport as SportSlug];
  const { profile } = await requireProfile();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [events, sportProfile] = await Promise.all([
    prisma.event.findMany({
      where: { sport, eventDate: { gte: today } },
      orderBy: [{ eventDate: "asc" }, { startTime: "asc" }],
      take: 20,
      select: {
        id: true,
        name: true,
        locationText: true,
        eventDate: true,
        startTime: true,
        expectedSize: true,
        rsvpUrl: true,
        createdByProfileId: true,
      },
    }),
    prisma.sportProfile.findUnique({
      where: { profileId_sport: { profileId: profile.id, sport } },
      select: { optedIntoMatching: true },
    }),
  ]);

  const invite = inviteMessage(meta.smsPhrase);

  return (
    <>
      {/* 1. Sport name header, with the sport's photo as a banner. */}
      <header className="relative h-44 overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.imageUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
        <div className="relative flex h-full flex-col justify-between px-5 pb-5 pt-6">
          <Link
            href="/home"
            className="stat inline-block w-fit text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 hover:text-white"
          >
            ← All sports
          </Link>
          <h1 className="display text-4xl text-white">{meta.label}</h1>
        </div>
      </header>

      <main className="px-5 py-5">
        {/* 2. Compact "+ Add Event" — deliberately not a full-width CTA, so it
            doesn't push Find a Partner below the fold. */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="display text-xl text-ink">This week</h2>
          <Link
            href={`/sports/${sport}/events/new`}
            className="stat shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-brand hover:underline"
          >
            + Add event
          </Link>
        </div>

        {/* 3. Compact horizontal carousel */}
        <EventCarousel
          events={events.map((e) => ({
            id: e.id,
            name: e.name,
            locationText: e.locationText,
            eventDate: e.eventDate,
            startTime: e.startTime,
            expectedSize: e.expectedSize,
            rsvpUrl: e.rsvpUrl,
            memberSubmitted: e.createdByProfileId !== null,
          }))}
        />

        {/* 4. Find a Partner — reachable without scrolling past the carousel.
            Per spec, running/tennis/lifting skip this section entirely in
            MVP (no sport-specific fields built for them yet) and go straight
            from the carousel to the invite-a-friend line. */}
        {meta.matchingEnabled ? (
          <section className="mt-6">
            <SectionHeading>Find a Partner</SectionHeading>
            {sportProfile?.optedIntoMatching ? (
              <PartnerDeckSection
                sport={sport}
                matchPhrase={meta.matchPhrase}
                viewer={profile}
                inviteMessage={invite}
              />
            ) : (
              <Card className="px-5 py-6 text-center">
                <p className="display text-lg text-ink">{meta.label}</p>
                <p className="mx-auto mt-2 max-w-xs text-sm text-ink/65">
                  Find someone to train with nearby.
                </p>
                <div className="mt-4">
                  <ButtonLink href={`/sports/${sport}/opt-in`} size="lg">
                    Get started
                  </ButtonLink>
                </div>
              </Card>
            )}
          </section>
        ) : null}

        {/* 5. Invite a friend */}
        <div className="mt-6">
          <InviteFriendLink message={invite} />
        </div>
      </main>
    </>
  );
}

async function PartnerDeckSection({
  sport,
  matchPhrase,
  viewer,
  inviteMessage,
}: {
  sport: "bjj" | "running" | "tennis" | "lifting";
  matchPhrase: string;
  viewer: { id: string; lat: number; lng: number; travelRadiusMiles: number };
  inviteMessage: string;
}) {
  const [candidates, hadPasses] = await Promise.all([
    getCandidates(viewer, sport),
    hasPasses(viewer.id, sport),
  ]);

  return (
    <PartnerDeck
      sport={sport}
      matchPhrase={matchPhrase}
      // distance is dropped here — ordering is server-side only.
      profiles={candidates.map(toDeckProfile)}
      hadPasses={hadPasses}
      inviteMessage={inviteMessage}
    />
  );
}
