import Link from "next/link";

import { EditProfileForm } from "@/components/forms/edit-profile-form";
import { photoStorageConfigured } from "@/lib/photo";
import { requireProfile } from "@/lib/session";

export const metadata = { title: "Edit profile · SportMe" };

export default async function EditProfilePage() {
  const { profile } = await requireProfile();

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

      <main className="px-5 py-6">
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
      </main>
    </>
  );
}
