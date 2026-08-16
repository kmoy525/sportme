"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { FormError } from "@/components/ui";
import { updateProfileAction } from "@/lib/actions/profile-actions";
import { emptyFormState } from "@/lib/form";

import { BaselineFields, type BaselineDefaults } from "./baseline-fields";

export function EditProfileForm({
  defaults,
  photoStorageConfigured,
}: {
  defaults: BaselineDefaults;
  photoStorageConfigured: boolean;
}) {
  const [state, action] = useActionState(updateProfileAction, emptyFormState);
  const saved = state === emptyFormState ? false : Boolean(state.success);

  return (
    <form action={action} className="space-y-5">
      <FormError>{state.error}</FormError>
      {saved ? (
        <p className="rounded-2xl border border-ink/15 bg-ink/5 px-3 py-2 text-sm font-medium text-ink">
          Saved.
        </p>
      ) : null}
      <BaselineFields
        state={state}
        defaults={defaults}
        photoStorageConfigured={photoStorageConfigured}
      />
      <SubmitButton size="lg" pendingLabel="Saving…">
        Save changes
      </SubmitButton>
    </form>
  );
}
