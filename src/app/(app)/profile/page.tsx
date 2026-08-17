import Link from "next/link";

import { formatDay, formatTime } from "@/components/event-carousel";
import { ChevronRightIcon } from "@/components/icons";
import { ProfilePhoto } from "@/components/profile-card";
import { Badge, buttonClass, Card, EmptyState } from "@/components/ui";
import { logoutAction } from "@/lib/actions/auth-actions";
import { formatPhone } from "@/lib/identifier";
import { requireAccount, requireProfile } from "@/lib/session";
import { SPORT_META, SPORTS, sportLabel } from "@/lib/sports";
import { prisma } from "@/lib/db";

export const metadata = { title: "Profile · SportMe" };

export default async function ProfilePage() {
  const { profile } = await requireProfile();
  const account = await requireAccount();

  const [joined, eventsOrganized] = await Promise.all([
    prisma.sportProfile.findMany({
      where: { profileId: profile.id },
      select: { sport: true, optedIntoMatching: true },
    }),
    prisma.event.findMany({
      where: { createdByProfileId: profile.id },
      orderBy: { eventDate: "desc" },
      select: { id: true, sport: true, name: true, eventDate: true, startTime: true },
    }),
  ]);
  const joinedBySport = new Map(joined.map((s) => [s.sport, s]));

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <h1 className="display text-3xl text-ink">Profile</h1>
      </header>

      <main className="space-y-6 px-5 py-5">
        <Card className="flex items-center gap-3 px-4 py-4">
          <ProfilePhoto photoUrl={profile.photoUrl} name={profile.name} />
          <div className="min-w-0 flex-1">
            <p className="display truncate text-2xl text-ink">{profile.name}</p>
            <p className="truncate text-sm text-ink/55">
              {account.email ?? (account.phone ? formatPhone(account.phone) : "")}
            </p>
          </div>
          <Link
            href="/profile/edit"
            className="stat shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-brand hover:underline"
          >
            Edit
          </Link>
        </Card>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="display text-xl text-ink">Sports</h2>
            <Link
              href="/home"
              className="stat shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-brand hover:underline"
            >
              + Add a sport
            </Link>
          </div>

          {joined.length === 0 ? (
            <Card className="px-5 py-6 text-center">
              <p className="text-sm text-ink/65">You haven&apos;t joined a sport yet.</p>
              <div className="mt-4">
                <Link href="/home" className={buttonClass()}>
                  Browse sports
                </Link>
              </div>
            </Card>
          ) : (
            <ul className="space-y-2">
              {SPORTS.filter((slug) => joinedBySport.has(slug)).map((slug) => {
                const meta = SPORT_META[slug];
                const state = joinedBySport.get(slug)!;
                return (
                  <li key={slug}>
                    <Link href={`/profile/sports/${slug}`} className="block">
                      <Card className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:border-ink/40">
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-ink">{meta.label}</p>
                          <p className="mt-0.5 text-xs text-ink/50">
                            {meta.matchingEnabled
                              ? state.optedIntoMatching
                                ? "Finding partners"
                                : "Joined, matching paused"
                              : "Joined"}
                          </p>
                        </div>
                        {state.optedIntoMatching ? <Badge>Active</Badge> : null}
                        <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="display mb-3 text-xl text-ink">Events organized</h2>

          {eventsOrganized.length === 0 ? (
            <EmptyState
              title="No events yet"
              body="Events you create will show up here."
            />
          ) : (
            <ul className="space-y-2">
              {eventsOrganized.map((event) => (
                <li key={event.id}>
                  <Link href={`/events/${event.id}`} className="block">
                    <Card className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:border-ink/40">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-ink">
                          {event.name}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/50">
                          {sportLabel(event.sport)} · {formatDay(event.eventDate)} ·{" "}
                          {formatTime(event.startTime)}
                        </p>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form action={logoutAction}>
          <button
            type="submit"
            className={buttonClass({ variant: "outline", size: "lg", full: true })}
          >
            Log out
          </button>
        </form>
      </main>
    </>
  );
}
