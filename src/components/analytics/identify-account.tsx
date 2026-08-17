"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

/**
 * Merges the anonymous pre-signup PostHog visitor (landing page CTA click,
 * signup pageview, the server-captured account_created event) onto this
 * account, so the CTA-to-signup funnel resolves to one person. Safe to call
 * on every /onboarding load — identifying with an already-current distinct
 * ID is a no-op.
 */
export function IdentifyAccount({ accountId }: { accountId: string }) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.identify(accountId);
  }, [accountId, posthog]);

  return null;
}
