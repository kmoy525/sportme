import Link from "next/link";

import { ProfilePhoto } from "@/components/profile-card";
import { Card, EmptyState } from "@/components/ui";
import { unblockProfileAction } from "@/lib/actions/safety-actions";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";

export const metadata = { title: "Blocked members · SportMe" };

export default async function BlockedListPage() {
  const { profile } = await requireProfile();

  const blocks = await prisma.block.findMany({
    where: { blockerProfileId: profile.id },
    orderBy: { createdAt: "desc" },
    select: {
      blockedProfileId: true,
      blocked: { select: { id: true, name: true, photoUrl: true } },
    },
  });

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href="/profile/edit"
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← Edit profile
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">Blocked members</h1>
      </header>

      <main className="px-5 py-6">
        {blocks.length === 0 ? (
          <EmptyState title="Nobody blocked" body="Blocked members will show up here." />
        ) : (
          <ul className="space-y-2">
            {blocks.map((b) => (
              <li key={b.blockedProfileId}>
                <Card className="flex items-center gap-3 px-3 py-3">
                  <ProfilePhoto
                    photoUrl={b.blocked.photoUrl}
                    name={b.blocked.name}
                    size="sm"
                  />
                  <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
                    {b.blocked.name}
                  </p>
                  <form action={unblockProfileAction}>
                    <input type="hidden" name="profileId" value={b.blockedProfileId} />
                    <button
                      type="submit"
                      className="stat shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-ink hover:underline"
                    >
                      Unblock
                    </button>
                  </form>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
