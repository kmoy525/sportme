"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { FormError } from "@/components/ui";
import { confirmAgeAction } from "@/lib/actions/auth-actions";
import { emptyFormState, fieldError } from "@/lib/form";

export function ConfirmAgeForm() {
  const [state, action] = useActionState(confirmAgeAction, emptyFormState);

  return (
    <form action={action} className="space-y-4">
      <FormError>{state.error}</FormError>

      <label className="flex items-start gap-3 rounded-2xl border border-ink/15 bg-white p-3">
        <input
          name="ageConfirmed"
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#ff4754]"
        />
        <span className="text-sm text-ink">
          I confirm I am 18 or older and agree to the{" "}
          <Link href="/terms" className="font-semibold text-ink underline">
            Terms of Service
          </Link>
          .
        </span>
      </label>
      {fieldError(state, "ageConfirmed") ? (
        <p className="text-xs font-medium text-red-700">
          {fieldError(state, "ageConfirmed")}
        </p>
      ) : null}

      <SubmitButton size="lg">Continue</SubmitButton>
    </form>
  );
}
