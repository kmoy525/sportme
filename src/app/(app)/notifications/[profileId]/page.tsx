import Link from "next/link";
import { notFound } from "next/navigation";

import { FullProfile } from "@/components/full-profile";
import { RespondToLike } from "@/components/respond-to-like";
import { prisma } from "@/lib/db";
import { getVisibleProfile } from "@/lib/profiles";
import { requireProfile } from "@/lib/session";
import { sportLabel } from "@/lib/sports";

export default async function IncomingLikePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  const { profile } = await requireProfile();

  // Only the sports they actually thumbed you up in.
  const likes = await prisma.like.findMany({
    where: { fromProfileId: profileId, toProfileId: profile.id },
    select: { sport: true },
  });
  if (likes.length === 0) notFound();

  const sports = [...new Set(likes.map((l) => l.sport))];
  const target = await getVisibleProfile(profile.id, profileId, sports);
  if (!target) notFound();

  return (
    <>
      <header className="bg-turf px-5 pb-5 pt-6">
        <Link
          href="/notifications"
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-chalk/55 hover:text-chalk"
        >
          ← Notifications
        </Link>
        <h1 className="display mt-1.5 text-2xl leading-tight text-chalk">
          {target.name} wants to train with you
        </h1>
        <p className="stat mt-1 text-[11px] uppercase tracking-[0.12em] text-scoreboard">
          {sports.map(sportLabel).join(" · ")}
        </p>
      </header>

      <main className="px-5 py-5">
        <FullProfile profile={target} />
        <div className="mt-6">
          <RespondToLike profileId={target.id} sports={sports} />
        </div>
      </main>
    </>
  );
}
