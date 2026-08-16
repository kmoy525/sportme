"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { FormError } from "@/components/ui";
import { onboardingAction } from "@/lib/actions/profile-actions";
import { emptyFormState } from "@/lib/form";

import { BaselineFields } from "./baseline-fields";

export function OnboardingForm({
  photoStorageConfigured,
}: {
  photoStorageConfigured: boolean;
}) {
  const [state, action] = useActionState(onboardingAction, emptyFormState);

  return (
    <form action={action} className="space-y-5">
      <FormError>{state.error}</FormError>
      <BaselineFields state={state} photoStorageConfigured={photoStorageConfigured} />
      <SubmitButton size="lg" pendingLabel="Setting up…">
        Finish setup
      </SubmitButton>
    </form>
  );
}
