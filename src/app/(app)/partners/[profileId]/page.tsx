import Link from "next/link";
import { notFound } from "next/navigation";

import { FullProfile } from "@/components/full-profile";
import { ButtonLink } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getVisibleProfile } from "@/lib/profiles";
import { requireProfile } from "@/lib/session";

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  const { profile } = await requireProfile();

  const target = await getVisibleProfile(profile.id, profileId);
  if (!target) notFound();

  const [profileAId, profileBId] =
    profile.id < profileId ? [profile.id, profileId] : [profileId, profile.id];

  const match = await prisma.match.findFirst({
    where: { profileAId, profileBId },
    select: { chat: { select: { id: true } } },
  });

  return (
    <>
      <header className="bg-turf px-5 pb-5 pt-6">
        <Link
          href="/notifications"
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-chalk/55 hover:text-chalk"
        >
          ← Back
        </Link>
        <h1 className="display mt-1.5 text-3xl text-chalk">{target.name}</h1>
        {target.isPartner ? (
          <p className="stat mt-1 text-[11px] uppercase tracking-[0.12em] text-scoreboard">
            Training Partner
          </p>
        ) : null}
      </header>

      <main className="px-5 py-5">
        <FullProfile profile={target} />

        {match?.chat ? (
          <div className="mt-6">
            <ButtonLink href={`/chats/${match.chat.id}`} size="lg" full>
              Open chat
            </ButtonLink>
          </div>
        ) : null}
      </main>
    </>
  );
}
