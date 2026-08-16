import { redirect } from "next/navigation";

import { ConfirmAgeForm } from "@/components/forms/confirm-age-form";
import { requireAccount } from "@/lib/session";

export const metadata = { title: "Confirm your age · SportMe" };

/**
 * OAuth sign-ups skip the signup form's age checkbox, so they land here until
 * they confirm. Credentials sign-ups pass straight through.
 */
export default async function ConfirmAgePage() {
  const account = await requireAccount();

  if (account.ageConfirmed && account.tosAcceptedAt) {
    redirect(account.profile ? "/home" : "/onboarding");
  }

  return (
    <div>
      <h1 className="display text-3xl text-ink">One more thing</h1>
      <p className="mt-2 text-sm text-ink/65">
        SportMe is for adults only. Confirm your age to continue.
      </p>
      <div className="mt-6">
        <ConfirmAgeForm />
      </div>
    </div>
  );
}
