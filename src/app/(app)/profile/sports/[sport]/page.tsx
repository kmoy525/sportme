import Link from "next/link";
import { notFound } from "next/navigation";

import { BjjFieldsForm } from "@/components/forms/bjj-fields-form";
import { LiftingFieldsForm } from "@/components/forms/lifting-fields-form";
import { RunningFieldsForm } from "@/components/forms/running-fields-form";
import { TennisFieldsForm } from "@/components/forms/tennis-fields-form";
import { ConfirmButton } from "@/components/confirm-button";
import { ButtonLink, Card } from "@/components/ui";
import { deleteSportProfileAction, setMatchingOptInAction } from "@/lib/actions/sport-actions";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";
import { parseSport, SPORT_META, type SportSlug } from "@/lib/sports";

export default async function ManageSportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const sport = parseSport((await params).sport);
  if (!sport) notFound();

  const meta = SPORT_META[sport as SportSlug];
  const { profile } = await requireProfile();

  const sportProfile = await prisma.sportProfile.findUnique({
    where: { profileId_sport: { profileId: profile.id, sport } },
    select: {
      optedIntoMatching: true,
      description: true,
      bjj: true,
      running: true,
      tennis: true,
      lifting: true,
    },
  });

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href="/profile"
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← Profile
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">{meta.label}</h1>
      </header>

      <main className="space-y-6 px-5 py-6">
        {!sportProfile ? (
          <Card className="px-5 py-6 text-center">
            <p className="text-sm text-ink/65">
              You haven&apos;t joined {meta.lowerLabel} yet.
            </p>
            <div className="mt-4">
              <ButtonLink href={`/sports/${sport}`} size="lg">
                Go to {meta.label}
              </ButtonLink>
            </div>
          </Card>
        ) : (
          <>
            <Card className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-[15px] font-semibold text-ink">Finding partners</p>
                <p className="mt-0.5 text-xs text-ink/50">
                  Turning this off hides you from the deck. Your info stays saved.
                </p>
              </div>
              <form action={setMatchingOptInAction}>
                <input type="hidden" name="sport" value={sport} />
                <input
                  type="hidden"
                  name="optedIn"
                  value={(!sportProfile.optedIntoMatching).toString()}
                />
                <button
                  type="submit"
                  aria-pressed={sportProfile.optedIntoMatching}
                  className={
                    sportProfile.optedIntoMatching
                      ? "h-8 w-14 shrink-0 rounded-full bg-brand p-1 transition-colors"
                      : "h-8 w-14 shrink-0 rounded-full bg-ink/15 p-1 transition-colors"
                  }
                >
                  <span
                    className={
                      sportProfile.optedIntoMatching
                        ? "block h-6 w-6 translate-x-6 rounded-full bg-white transition-transform"
                        : "block h-6 w-6 translate-x-0 rounded-full bg-white transition-transform"
                    }
                  />
                </button>
              </form>
            </Card>

            <div>
              <h2 className="display mb-3 text-xl text-ink">Your details</h2>
              {sport === "bjj" ? (
                <BjjFieldsForm
                  sport={sport}
                  defaults={{ ...sportProfile.bjj, description: sportProfile.description }}
                  submitLabel="Save changes"
                />
              ) : sport === "running" ? (
                <RunningFieldsForm
                  defaults={{ ...sportProfile.running, description: sportProfile.description }}
                  submitLabel="Save changes"
                />
              ) : sport === "tennis" ? (
                <TennisFieldsForm
                  defaults={{ ...sportProfile.tennis, description: sportProfile.description }}
                  submitLabel="Save changes"
                />
              ) : (
                <LiftingFieldsForm
                  defaults={{ ...sportProfile.lifting, description: sportProfile.description }}
                  submitLabel="Save changes"
                />
              )}
            </div>

            <div>
              <h2 className="display mb-3 text-xl text-ink">Danger zone</h2>
              <Card className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-[15px] font-semibold text-ink">
                    Delete {meta.label} profile
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    Removes your {meta.lowerLabel} details and matching. Your account and
                    other sports are unaffected.
                  </p>
                </div>
                <form action={deleteSportProfileAction}>
                  <input type="hidden" name="sport" value={sport} />
                  <ConfirmButton
                    confirmMessage={`Delete your ${meta.label} profile? This can't be undone.`}
                    className="stat shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-red-600 hover:underline"
                  >
                    Delete
                  </ConfirmButton>
                </form>
              </Card>
            </div>
          </>
        )}
      </main>
    </>
  );
}
