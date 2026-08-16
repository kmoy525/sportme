import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/forms/onboarding-form";
import { BoltIcon } from "@/components/icons";
import { photoStorageConfigured } from "@/lib/photo";
import { requireAccount } from "@/lib/session";

export const metadata = { title: "Set up your profile · SportMe" };

export default async function OnboardingPage() {
  const account = await requireAccount();

  if (!account.ageConfirmed || !account.tosAcceptedAt) redirect("/signup/confirm");
  if (account.profile) redirect("/home");

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="border-b border-ink/10 bg-white px-5 py-6">
        <div className="mx-auto flex max-w-md items-center gap-2 text-ink">
          <BoltIcon className="h-6 w-6 text-brand" />
          <span className="display text-2xl tracking-wide">SportMe</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 py-8">
        <h1 className="display text-3xl text-ink">Set up your profile</h1>
        <p className="mt-2 text-sm text-ink/65">
          This is the same across every sport. You&apos;ll only do it once.
        </p>

        <div className="mt-6">
          <OnboardingForm photoStorageConfigured={photoStorageConfigured()} />
        </div>
      </main>
    </div>
  );
}
