import { clearProfileAction, confirmHiddenAction } from "@/lib/actions/admin-actions";
import { prisma } from "@/lib/db";
import { reportReasonLabel } from "@/lib/enums";
import { isAdminRequest } from "@/lib/admin";

export const metadata = { title: "Review queue — internal" };

/**
 * Bare-bones internal review queue for auto-hidden profiles, per MVP scope —
 * no full admin panel. Gated by ADMIN_TOKEN, not a real login.
 */
export default async function AdminReviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = new URLSearchParams(
    Object.entries(await searchParams).filter(([, v]) => v !== undefined) as [
      string,
      string,
    ][],
  );
  const token = params.get("token") ?? "";

  if (!(await isAdminRequest(params))) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <h1 className="text-xl font-bold">Review queue</h1>
        <p className="mt-2 text-sm text-ink/60">
          Add <code>?token=…</code> matching the server&apos;s ADMIN_TOKEN.
        </p>
      </main>
    );
  }

  const hiddenProfiles = await prisma.profile.findMany({
    where: { hidden: true },
    select: {
      id: true,
      name: true,
      zipCode: true,
      reportsAgainst: {
        where: { reviewedAt: null },
        orderBy: { createdAt: "desc" },
        select: { reason: true, notes: true, createdAt: true, reporterProfileId: true },
      },
    },
  });

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="text-2xl font-bold">Review queue</h1>
      <p className="mt-1 text-sm text-ink/60">
        Profiles auto-hidden after crossing the report threshold.
      </p>

      {hiddenProfiles.length === 0 ? (
        <p className="mt-8 text-sm text-ink/50">Nothing pending review.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {hiddenProfiles.map((p) => (
            <li key={p.id} className="rounded-lg border border-ink/10 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {p.name} <span className="text-sm font-normal text-ink/40">({p.zipCode})</span>
                </h2>
                <span className="text-xs font-medium text-red-700">
                  {p.reportsAgainst.length} open report
                  {p.reportsAgainst.length === 1 ? "" : "s"}
                </span>
              </div>

              <ul className="mt-3 space-y-2">
                {p.reportsAgainst.map((r, i) => (
                  <li key={i} className="rounded bg-ink/[0.03] px-3 py-2 text-sm">
                    <p className="font-medium">{reportReasonLabel(r.reason)}</p>
                    {r.notes ? <p className="mt-0.5 text-ink/70">{r.notes}</p> : null}
                    <p className="mt-0.5 text-xs text-ink/40">
                      {r.createdAt.toISOString()} · reporter {r.reporterProfileId}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex gap-2">
                <form action={clearProfileAction}>
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="profileId" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-md bg-turf px-3 py-2 text-sm font-semibold text-white"
                  >
                    Clear &amp; unhide
                  </button>
                </form>
                <form action={confirmHiddenAction}>
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="profileId" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    Confirm — keep hidden
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
