"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { signIn, signOut } from "../auth";
import { prisma } from "../db";
import { bool, str, type FormState } from "../form";
import { normalizeIdentifier } from "../identifier";
import { requireAccount } from "../session";

const MIN_PASSWORD_LENGTH = 8;

export async function signUpAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const identifierRaw = str(form, "identifier");
  const password = str(form, "password");
  const ageConfirmed = bool(form, "ageConfirmed");

  const fieldErrors: Record<string, string> = {};
  const identifier = normalizeIdentifier(identifierRaw);

  if (!identifierRaw) {
    fieldErrors.identifier = "Enter an email or phone number.";
  } else if (!identifier) {
    fieldErrors.identifier =
      "That doesn't look like an email or a 10-digit phone number.";
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    fieldErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!ageConfirmed) {
    fieldErrors.ageConfirmed = "You must confirm you are 18 or older to continue.";
  }

  if (!identifier || Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const where =
    identifier.kind === "email" ? { email: identifier.value } : { phone: identifier.value };

  const existing = await prisma.account.findFirst({ where });
  if (existing) {
    return {
      fieldErrors: { identifier: "An account already exists for that. Log in instead." },
    };
  }

  await prisma.account.create({
    data: {
      ...where,
      authProvider: "credentials",
      passwordHash: await bcrypt.hash(password, 10),
      ageConfirmed: true,
      tosAcceptedAt: new Date(),
    },
  });

  // signIn throws a NEXT_REDIRECT on success, which must propagate.
  try {
    await signIn("credentials", {
      identifier: identifier.value,
      password,
      redirectTo: "/onboarding",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Try logging in." };
    }
    throw error;
  }
  return {};
}

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const identifier = normalizeIdentifier(str(form, "identifier"));
  const password = str(form, "password");

  if (!identifier || !password) {
    return { error: "Enter your email or phone and your password." };
  }

  try {
    await signIn("credentials", {
      identifier: identifier.value,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Those details didn't match an account." };
    }
    throw error;
  }
  return {};
}

/** OAuth sign-ups land here until they confirm age + accept the ToS. */
export async function confirmAgeAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const account = await requireAccount();

  if (!bool(form, "ageConfirmed")) {
    return {
      fieldErrors: { ageConfirmed: "You must confirm you are 18 or older to continue." },
    };
  }

  await prisma.account.update({
    where: { id: account.id },
    data: { ageConfirmed: true, tosAcceptedAt: new Date() },
  });

  redirect(account.profile ? "/" : "/onboarding");
}

export async function oauthSignInAction(form: FormData) {
  const provider = str(form, "provider");
  if (provider !== "google" && provider !== "apple") return;
  await signIn(provider, { redirectTo: "/signup/confirm" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
