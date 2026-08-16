"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { Field, FormError, inputClass } from "@/components/ui";
import { loginAction } from "@/lib/actions/auth-actions";
import { emptyFormState } from "@/lib/form";

export function LoginForm() {
  const [state, action] = useActionState(loginAction, emptyFormState);

  return (
    <form action={action} className="space-y-4">
      <FormError>{state.error}</FormError>

      <Field label="Email or phone">
        <input
          name="identifier"
          type="text"
          autoComplete="username"
          required
          className={inputClass}
        />
      </Field>

      <Field label="Password">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>

      <SubmitButton size="lg" pendingLabel="Logging in…">
        Log in
      </SubmitButton>
    </form>
  );
}
