"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { signUpAction } from "@/lib/actions/auth-actions";
import { emptyFormState, fieldError } from "@/lib/form";

export function SignupForm() {
  const [state, action] = useActionState(signUpAction, emptyFormState);

  return (
    <form action={action} className="space-y-4">
      <FormError>{state.error}</FormError>

      <Field
        label="Email or phone"
        hint="We'll use this to sign you in."
        error={fieldError(state, "identifier")}
      >
        <input
          name="identifier"
          type="text"
          autoComplete="username"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
      </Field>

      <Field label="Password" error={fieldError(state, "password")}>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </Field>

      <div>
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
          <p className="mt-1 text-xs font-medium text-red-700">
            {fieldError(state, "ageConfirmed")}
          </p>
        ) : null}
      </div>

      <SubmitButton size="lg" pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
