import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDay, formatTime } from "@/components/event-carousel";
import { ConfirmButton } from "@/components/confirm-button";
import { ProfilePhoto } from "@/components/profile-card";
import { buttonClass, ButtonLink, Card } from "@/components/ui";
import { deleteEventAction } from "@/lib/actions/event-actions";
import { prisma } from "@/lib/db";
import { googleMapsApiKey } from "@/lib/maps";
import { requireProfile } from "@/lib/session";
import { sportLabel } from "@/lib/sports";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const { profile } = await requireProfile();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      sport: true,
      name: true,
      description: true,
      locationText: true,
      lat: true,
      lng: true,
      eventDate: true,
      startTime: true,
      expectedSize: true,
      rsvpUrl: true,
      createdByProfileId: true,
      createdBy: { select: { id: true, name: true, photoUrl: true } },
    },
  });
  if (!event) notFound();

  const canEdit = event.createdByProfileId === profile.id;
  const apiKey = googleMapsApiKey();

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href={`/sports/${event.sport}`}
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← {sportLabel(event.sport)}
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">{event.name}</h1>
      </header>

      <main className="space-y-4 px-5 py-6">
        <Card className="px-4 py-4">
          <p className="stat text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">
            {formatDay(event.eventDate)} · {formatTime(event.startTime)}
          </p>
          <p className="mt-2 text-[15px] font-semibold text-ink">{event.locationText}</p>
          {event.expectedSize ? (
            <p className="mt-1 text-sm text-ink/60">~{event.expectedSize} people expected</p>
          ) : null}

          {apiKey ? (
            <iframe
              title="Event location"
              className="mt-3 h-40 w-full rounded-2xl border border-ink/10"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${event.lat},${event.lng}`}
            />
          ) : null}
        </Card>

        {event.createdBy ? (
          <Card className="px-4 py-4">
            <h2 className="stat mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
              Organizer
            </h2>
            <Link
              href={
                event.createdBy.id === profile.id
                  ? "/profile"
                  : `/partners/${event.createdBy.id}`
              }
              className="flex items-center gap-3 transition-opacity hover:opacity-75"
            >
              <ProfilePhoto
                photoUrl={event.createdBy.photoUrl}
                name={event.createdBy.name}
                size="sm"
              />
              <span className="text-[15px] font-semibold text-ink">
                {event.createdBy.id === profile.id ? "You" : event.createdBy.name}
              </span>
            </Link>
          </Card>
        ) : null}

        {event.description ? (
          <Card className="px-4 py-4">
            <h2 className="stat mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
              Details
            </h2>
            <p className="whitespace-pre-wrap text-sm text-ink/80">{event.description}</p>
          </Card>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          {event.rsvpUrl ? (
            <a
              href={event.rsvpUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-brand px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand/90"
            >
              RSVP
            </a>
          ) : null}
          {canEdit ? (
            <ButtonLink href={`/events/${event.id}/edit`} variant="outline" full className="flex-1">
              Edit event
            </ButtonLink>
          ) : null}
          {canEdit ? (
            <form className="flex-1" action={deleteEventAction}>
              <input type="hidden" name="eventId" value={event.id} />
              <ConfirmButton
                confirmMessage={`Delete "${event.name}"? This removes it for everyone and can't be undone.`}
                className={buttonClass({ variant: "danger", full: true })}
              >
                Delete event
              </ConfirmButton>
            </form>
          ) : null}
        </div>
      </main>
    </>
  );
}
