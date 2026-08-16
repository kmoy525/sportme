import Link from "next/link";

import { ChevronRightIcon } from "@/components/icons";
import { ProfilePhoto } from "@/components/profile-card";
import { Badge, buttonClass, Card } from "@/components/ui";
import { logoutAction } from "@/lib/actions/auth-actions";
import { formatPhone } from "@/lib/identifier";
import { requireAccount, requireProfile } from "@/lib/session";
import { SPORT_META, SPORTS } from "@/lib/sports";
import { prisma } from "@/lib/db";

export const metadata = { title: "Profile · TrainWithMe" };

export default async function ProfilePage() {
  const { profile } = await requireProfile();
  const account = await requireAccount();

  const [joined, blockCount] = await Promise.all([
    prisma.sportProfile.findMany({
      where: { profileId: profile.id },
      select: { sport: true, optedIntoMatching: true },
    }),
    prisma.block.count({ where: { blockerProfileId: profile.id } }),
  ]);
  const joinedBySport = new Map(joined.map((s) => [s.sport, s]));

  return (
    <>
      <header className="bg-turf px-5 pb-5 pt-6">
        <h1 className="display text-3xl text-chalk">Profile</h1>
      </header>

      <main className="space-y-6 px-5 py-5">
        <Card className="flex items-center gap-3 px-4 py-4">
          <ProfilePhoto photoUrl={profile.photoUrl} name={profile.name} />
          <div className="min-w-0 flex-1">
            <p className="display truncate text-2xl text-turf">{profile.name}</p>
            <p className="truncate text-sm text-ink/55">
              {account.email ?? (account.phone ? formatPhone(account.phone) : "")}
            </p>
          </div>
          <Link
            href="/profile/edit"
            className="stat shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-cone hover:underline"
          >
            Edit
          </Link>
        </Card>

        <section>
          <h2 className="display mb-3 text-xl text-turf">Sports</h2>
          <ul className="space-y-2">
            {SPORTS.map((slug) => {
              const meta = SPORT_META[slug];
              const state = joinedBySport.get(slug);
              return (
                <li key={slug}>
                  <Link href={`/profile/sports/${slug}`} className="block">
                    <Card className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:border-turf/40">
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-ink">{meta.label}</p>
                        <p className="mt-0.5 text-xs text-ink/50">
                          {!state
                            ? "Not joined"
                            : meta.matchingEnabled
                              ? state.optedIntoMatching
                                ? "Finding partners"
                                : "Joined, matching paused"
                              : "Joined"}
                        </p>
                      </div>
                      {state?.optedIntoMatching ? <Badge>Active</Badge> : null}
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <Link href="/profile/blocked" className="block">
            <Card className="flex items-center justify-between px-4 py-3.5 transition-colors hover:border-turf/40">
              <span className="text-[15px] font-semibold text-ink">Blocked members</span>
              <span className="flex items-center gap-2 text-ink/50">
                {blockCount > 0 ? <span className="stat text-sm">{blockCount}</span> : null}
                <ChevronRightIcon className="h-5 w-5" />
              </span>
            </Card>
          </Link>
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
