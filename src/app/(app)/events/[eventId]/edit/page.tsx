import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { EventForm } from "@/components/forms/event-form";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";
import { sportLabel } from "@/lib/sports";

/**
 * Only the member who created an event can reach this page. Admin-curated
 * events (createdByProfileId null) redirect away — enforced again in
 * updateEventAction so this isn't just a UI-level gate.
 */
export default async function EditEventPage({
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
      zipCode: true,
      eventDate: true,
      startTime: true,
      expectedSize: true,
      rsvpUrl: true,
      createdByProfileId: true,
    },
  });
  if (!event) notFound();
  if (event.createdByProfileId !== profile.id) redirect(`/events/${eventId}`);

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href={`/events/${eventId}`}
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← {event.name}
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">Edit event</h1>
      </header>

      <main className="px-5 py-6">
        <EventForm
          sport={event.sport}
          defaultZip={event.zipCode}
          eventId={event.id}
          defaults={{
            name: event.name,
            description: event.description ?? undefined,
            locationText: event.locationText,
            zipCode: event.zipCode,
            eventDate: event.eventDate.toISOString().slice(0, 10),
            startTime: event.startTime,
            expectedSize: event.expectedSize ?? undefined,
            rsvpUrl: event.rsvpUrl ?? undefined,
          }}
        />
        <p className="mt-4 text-center text-sm text-ink/60">
          Sport: {sportLabel(event.sport)}
        </p>
      </main>
    </>
  );
}
