import "server-only";

import { PostHog } from "posthog-node";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * A fresh client per call, flushed immediately — serverless functions can
 * freeze or exit right after the response, so there's no background timer
 * to rely on the way a long-lived server would have. Returns null without a
 * key so callers degrade gracefully, matching the rest of this app's optional
 * integrations.
 */
export function getServerPostHog(): PostHog | null {
  if (!POSTHOG_KEY) return null;
  return new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST, flushAt: 1, flushInterval: 0 });
}
