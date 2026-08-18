import { IdentifyAccount } from "@/components/analytics/identify-account";
import { BoltIcon } from "@/components/icons";
import { SportSearch } from "@/components/sport-search";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";
import { SPORTS } from "@/lib/sports";

export const metadata = { title: "Home · SportMe" };

export default async function HomePage() {
  const { account, profile } = await requireProfile();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [joined, eventCounts] = await Promise.all([
    prisma.sportProfile.findMany({
      where: { profileId: profile.id },
      select: { sport: true },
    }),
    prisma.event.groupBy({
      by: ["sport"],
      where: { eventDate: { gte: today } },
      _count: { _all: true },
    }),
  ]);

  const joinedSet = new Set(joined.map((s) => s.sport));
  const countBySport = new Map(eventCounts.map((row) => [row.sport, row._count._all]));

  const sports = SPORTS.map((slug) => ({
    slug,
    joined: joinedSet.has(slug),
    eventCount: countBySport.get(slug) ?? 0,
  }));

  return (
    <>
      <IdentifyAccount accountId={account.id} />
      <header className="border-b border-ink/10 bg-white px-5 pb-6 pt-7">
        <div className="flex items-center gap-2 text-ink">
          <BoltIcon className="h-6 w-6 text-brand" />
          <span className="display text-2xl tracking-wide">SportMe</span>
        </div>
        <p className="mt-1 text-sm text-ink/70">
          Hi {profile.name.split(" ")[0]}. Let&apos;s find you someone to train with.
        </p>
      </header>

      <main className="px-5 py-5">
        <SportSearch sports={sports} />
      </main>
    </>
  );
}
