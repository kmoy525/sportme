import Link from "next/link";
import { notFound } from "next/navigation";

import { EventForm } from "@/components/forms/event-form";
import { requireProfile } from "@/lib/session";
import { parseSport, SPORT_META, type SportSlug } from "@/lib/sports";

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const sport = parseSport((await params).sport);
  if (!sport) notFound();

  const meta = SPORT_META[sport as SportSlug];
  const { profile } = await requireProfile();

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href={`/sports/${sport}`}
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← {meta.label}
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">Add an event</h1>
        <p className="mt-1 text-sm text-ink/70">
          Open mats, group runs, court time — anything the {meta.lowerLabel} crowd
          should know about.
        </p>
      </header>

      <main className="px-5 py-6">
        <EventForm sport={sport} defaultZip={profile.zipCode} />
      </main>
    </>
  );
}
