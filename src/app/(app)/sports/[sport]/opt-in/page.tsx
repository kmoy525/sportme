import Link from "next/link";
import { notFound } from "next/navigation";

import { BjjFieldsForm } from "@/components/forms/bjj-fields-form";
import { LiftingFieldsForm } from "@/components/forms/lifting-fields-form";
import { RunningFieldsForm } from "@/components/forms/running-fields-form";
import { TennisFieldsForm } from "@/components/forms/tennis-fields-form";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";
import { parseSport, SPORT_META, type SportSlug } from "@/lib/sports";

export default async function SportOptInPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const sport = parseSport((await params).sport);
  if (!sport) notFound();

  const meta = SPORT_META[sport as SportSlug];
  const { profile } = await requireProfile();

  const existing = await prisma.sportProfile.findUnique({
    where: { profileId_sport: { profileId: profile.id, sport } },
    select: { description: true, bjj: true, running: true, tennis: true, lifting: true },
  });

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href={`/sports/${sport}`}
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← {meta.label}
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">Your {meta.label}</h1>
        <p className="mt-1 text-sm text-ink/70">
          Other members see this on your card. Everything below is optional.
        </p>
      </header>

      <main className="px-5 py-6">
        {sport === "bjj" ? (
          <BjjFieldsForm
            sport={sport}
            defaults={{ ...existing?.bjj, description: existing?.description }}
            submitLabel="Start finding partners"
          />
        ) : sport === "running" ? (
          <RunningFieldsForm
            defaults={{ ...existing?.running, description: existing?.description }}
            submitLabel="Start finding partners"
          />
        ) : sport === "tennis" ? (
          <TennisFieldsForm
            defaults={{ ...existing?.tennis, description: existing?.description }}
            submitLabel="Start finding partners"
          />
        ) : (
          <LiftingFieldsForm
            defaults={{ ...existing?.lifting, description: existing?.description }}
            submitLabel="Start finding partners"
          />
        )}
      </main>
    </>
  );
}
