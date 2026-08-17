import Link from "next/link";

import { ConfirmButton } from "@/components/confirm-button";
import { ChevronRightIcon } from "@/components/icons";
import { EditProfileForm } from "@/components/forms/edit-profile-form";
import { Card } from "@/components/ui";
import { deleteAccountAction } from "@/lib/actions/auth-actions";
import { prisma } from "@/lib/db";
import { photoStorageConfigured } from "@/lib/photo";
import { requireProfile } from "@/lib/session";

export const metadata = { title: "Edit profile · SportMe" };

export default async function EditProfilePage() {
  const { profile } = await requireProfile();
  const blockCount = await prisma.block.count({ where: { blockerProfileId: profile.id } });

  return (
    <>
      <header className="border-b border-ink/10 bg-white px-5 pb-5 pt-6">
        <Link
          href="/profile"
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 hover:text-ink"
        >
          ← Profile
        </Link>
        <h1 className="display mt-1.5 text-3xl text-ink">Edit profile</h1>
      </header>

      <main className="space-y-6 px-5 py-6">
        <EditProfileForm
          defaults={{
            name: profile.name,
            ageRange: profile.ageRange,
            zipCode: profile.zipCode,
            travelRadiusMiles: profile.travelRadiusMiles,
            photoUrl: profile.photoUrl,
          }}
          photoStorageConfigured={photoStorageConfigured()}
        />

        <Link href="/profile/blocked" className="block">
          <Card className="flex items-center justify-between px-4 py-3.5 transition-colors hover:border-ink/40">
            <span className="text-[15px] font-semibold text-ink">Blocked members</span>
            <span className="flex items-center gap-2 text-ink/50">
              {blockCount > 0 ? <span className="stat text-sm">{blockCount}</span> : null}
              <ChevronRightIcon className="h-5 w-5" />
            </span>
          </Card>
        </Link>

        <div>
          <h2 className="display mb-3 text-xl text-ink">Danger zone</h2>
          <Card className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-[15px] font-semibold text-ink">Delete account</p>
              <p className="mt-0.5 text-xs text-ink/50">
                Permanently deletes your profile, matches, and messages. This can&apos;t
                be undone.
              </p>
            </div>
            <form action={deleteAccountAction}>
              <ConfirmButton
                confirmMessage="Delete your account? This permanently removes your profile, matches, and messages, and can't be undone."
                className="stat shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-red-600 hover:underline"
              >
                Delete
              </ConfirmButton>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}
