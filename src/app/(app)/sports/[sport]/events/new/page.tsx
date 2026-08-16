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
      <header className="bg-turf px-5 pb-5 pt-6">
        <Link
          href={`/sports/${sport}`}
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-chalk/55 hover:text-chalk"
        >
          ← {meta.label}
        </Link>
        <h1 className="display mt-1.5 text-3xl text-chalk">Add an event</h1>
        <p className="mt-1 text-sm text-chalk/70">
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
