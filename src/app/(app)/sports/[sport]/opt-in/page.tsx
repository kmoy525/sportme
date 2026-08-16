import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BjjFieldsForm } from "@/components/forms/bjj-fields-form";
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
  // Only jiu-jitsu has sport-specific matching fields in MVP.
  if (!meta.matchingEnabled) redirect(`/sports/${sport}`);

  const { profile } = await requireProfile();

  const existing = await prisma.sportProfile.findUnique({
    where: { profileId_sport: { profileId: profile.id, sport } },
    select: { bjj: true },
  });

  return (
    <>
      <header className="bg-turf px-5 pb-5 pt-6">
        <Link
          href={`/sports/${sport}`}
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-chalk/55 hover:text-chalk"
        >
          ← {meta.label}
        </Link>
        <h1 className="display mt-1.5 text-3xl text-chalk">Your {meta.label}</h1>
        <p className="mt-1 text-sm text-chalk/70">
          Other members see this on your card. Nothing here is required except your belt.
        </p>
      </header>

      <main className="px-5 py-6">
        <BjjFieldsForm
          sport={sport}
          defaults={existing?.bjj ?? undefined}
          submitLabel="Start finding partners"
        />
      </main>
    </>
  );
}
