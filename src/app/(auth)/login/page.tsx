import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/login-form";
import { buttonClass } from "@/components/ui";
import { oauthSignInAction } from "@/lib/actions/auth-actions";
import { enabledOAuthProviders } from "@/lib/auth";
import { getAccountId } from "@/lib/session";

export const metadata = { title: "Log in · TrainWithMe" };

export default async function LoginPage() {
  if (await getAccountId()) redirect("/");

  const { google, apple } = enabledOAuthProviders;

  return (
    <div>
      <h1 className="display text-3xl text-turf">Log in</h1>

      <div className="mt-6">
        <LoginForm />
      </div>

      {google || apple ? (
        <div className="mt-4 space-y-3">
          {google ? (
            <form action={oauthSignInAction}>
              <input type="hidden" name="provider" value="google" />
              <button
                type="submit"
                className={buttonClass({ variant: "outline", size: "lg", full: true })}
              >
                Continue with Google
              </button>
            </form>
          ) : null}
          {apple ? (
            <form action={oauthSignInAction}>
              <input type="hidden" name="provider" value="apple" />
              <button
                type="submit"
                className={buttonClass({ variant: "outline", size: "lg", full: true })}
              >
                Continue with Apple
              </button>
            </form>
          ) : null}
        </div>
      ) : null}

      <p className="mt-8 text-sm text-ink/65">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-turf underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
