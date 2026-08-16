import Link from "next/link";
import { redirect } from "next/navigation";

import { SignupForm } from "@/components/forms/signup-form";
import { enabledOAuthProviders } from "@/lib/auth";
import { oauthSignInAction } from "@/lib/actions/auth-actions";
import { getAccountId } from "@/lib/session";
import { buttonClass } from "@/components/ui";

export const metadata = { title: "Create account · SportMe" };

export default async function SignupPage() {
  if (await getAccountId()) redirect("/home");

  const { google, apple } = enabledOAuthProviders;
  const anyOAuth = google || apple;

  return (
    <div>
      <h1 className="display text-3xl text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink/65">
        Then you&apos;ll set up your profile once, and it works across every sport.
      </p>

      <div className="mt-6">
        <SignupForm />
      </div>

      {anyOAuth ? (
        <>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="stat text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
              or
            </span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <div className="space-y-3">
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
          <p className="mt-3 text-xs text-ink/55">
            You&apos;ll still confirm you&apos;re 18 or older on the next screen.
          </p>
        </>
      ) : null}

      <p className="mt-8 text-sm text-ink/65">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
