import Link from "next/link";

import { EditProfileForm } from "@/components/forms/edit-profile-form";
import { photoStorageConfigured } from "@/lib/photo";
import { requireProfile } from "@/lib/session";

export const metadata = { title: "Edit profile · TrainWithMe" };

export default async function EditProfilePage() {
  const { profile } = await requireProfile();

  return (
    <>
      <header className="bg-turf px-5 pb-5 pt-6">
        <Link
          href="/profile"
          className="stat text-[11px] font-semibold uppercase tracking-[0.12em] text-chalk/55 hover:text-chalk"
        >
          ← Profile
        </Link>
        <h1 className="display mt-1.5 text-3xl text-chalk">Edit profile</h1>
      </header>

      <main className="px-5 py-6">
        <EditProfileForm
          defaults={{
            name: profile.name,
            ageRange: profile.ageRange,
            zipCode: profile.zipCode,
            travelRadiusMiles: profile.travelRadiusMiles,
            preferredContact: profile.preferredContact,
            photoUrl: profile.photoUrl,
          }}
          photoStorageConfigured={photoStorageConfigured()}
        />
      </main>
    </>
  );
}
