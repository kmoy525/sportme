import { BoltIcon } from "@/components/icons";
import { SportSearch } from "@/components/sport-search";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";
import { SPORTS } from "@/lib/sports";

export const metadata = { title: "TrainWithMe" };

export default async function HomePage() {
  const { profile } = await requireProfile();

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
      <header className="bg-turf px-5 pb-6 pt-7">
        <div className="flex items-center gap-2 text-chalk">
          <BoltIcon className="h-6 w-6 text-scoreboard" />
          <span className="display text-2xl tracking-wide">TrainWithMe</span>
        </div>
        <p className="mt-1 text-sm text-chalk/70">
          Hey {profile.name.split(" ")[0]} — what are you training?
        </p>
      </header>

      <main className="px-5 py-5">
        <SportSearch sports={sports} />
      </main>
    </>
  );
}
