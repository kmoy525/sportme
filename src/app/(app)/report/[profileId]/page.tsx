import Link from "next/link";
import { notFound } from "next/navigation";

import { ReportForm } from "@/components/forms/report-form";
import { buttonClass } from "@/components/ui";
import { blockProfileAction } from "@/lib/actions/safety-actions";
import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";

/**
 * Report and block, reachable from anywhere a profile is visible: the swipe
 * card, notifications, chat, and the match profile view all link here.
 */
export default async function ReportPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  const { profile } = await requireProfile();
  if (profileId === profile.id) notFound();

  const target = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { id: true, name: true },
  });
  if (!target) notFound();

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href="/notifications"
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← Back
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">Report {target.name}</h1>
        <p className="mt-1 text-sm text-ink/70">
          We&apos;ll review this. Profiles with multiple reports are hidden automatically
          while we look into it.
        </p>
      </header>

      <main className="space-y-6 px-5 py-6">
        <ReportForm profileId={target.id} name={target.name} />

        <div className="border-t border-ink/10 pt-5">
          <p className="mb-3 text-sm text-ink/60">
            Just want to stop seeing {target.name}? You can block without reporting.
          </p>
          <BlockOnlyForm profileId={target.id} name={target.name} />
        </div>
      </main>
    </>
  );
}

function BlockOnlyForm({ profileId, name }: { profileId: string; name: string }) {
  async function blockOnly(formData: FormData) {
    "use server";
    await blockProfileAction({}, formData);
  }

  return (
    <form action={blockOnly}>
      <input type="hidden" name="profileId" value={profileId} />
      <button type="submit" className={buttonClass({ variant: "outline", full: true })}>
        Block {name}
      </button>
    </form>
  );
}
