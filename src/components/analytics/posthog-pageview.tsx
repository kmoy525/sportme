"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

/**
 * App Router client-side navigations don't trigger a full page load, so
 * posthog-js's automatic pageview capture (which relies on that) misses
 * them — fire $pageview manually on every route change instead.
 */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) return;
    const search = searchParams.toString();
    posthog.capture("$pageview", {
      $current_url: `${window.origin}${pathname}${search ? `?${search}` : ""}`,
    });
  }, [pathname, searchParams, posthog]);

  return null;
}
