import Link from "next/link";
import { notFound } from "next/navigation";

import { BjjFieldsForm } from "@/components/forms/bjj-fields-form";
import { SubmitButton } from "@/components/submit-button";
import { optInGenericSportAction } from "@/lib/actions/sport-actions";
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

  const isBjj = sport === "bjj";

  const existing = isBjj
    ? await prisma.sportProfile.findUnique({
        where: { profileId_sport: { profileId: profile.id, sport } },
        select: { bjj: true },
      })
    : null;

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href={`/sports/${sport}`}
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← {meta.label}
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">
          {isBjj ? `Your ${meta.label}` : `Find someone for ${meta.lowerLabel}`}
        </h1>
        <p className="mt-1 text-sm text-ink/70">
          {isBjj
            ? "Other members see this on your card. Nothing here is required except your belt."
            : "We'll start showing you nearby people to train with."}
        </p>
      </header>

      <main className="px-5 py-6">
        {isBjj ? (
          <BjjFieldsForm
            sport={sport}
            defaults={existing?.bjj ?? undefined}
            submitLabel="Start finding partners"
          />
        ) : (
          <form action={optInGenericSportAction}>
            <input type="hidden" name="sport" value={sport} />
            <SubmitButton size="lg" pendingLabel="Starting…">
              Start finding partners
            </SubmitButton>
          </form>
        )}
      </main>
    </>
  );
}
