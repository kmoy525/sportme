"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ChatBubbleIcon, HomeIcon, PersonIcon } from "./icons";
import { cx } from "./ui";

const TABS = [
  { href: "/home", label: "Home", Icon: HomeIcon },
  { href: "/notifications", label: "Chats", Icon: ChatBubbleIcon },
  { href: "/profile", label: "Profile", Icon: PersonIcon },
] as const;

const POLL_MS = 15000;

export function BottomNav({ hasNotificationBadge }: { hasNotificationBadge: boolean }) {
  const pathname = usePathname();
  const [hasUnread, setHasUnread] = useState(hasNotificationBadge);

  // Keep in sync with the server-rendered value on every navigation (e.g.
  // after visiting /notifications, which clears it).
  useEffect(() => {
    setHasUnread(hasNotificationBadge);
  }, [hasNotificationBadge]);

  // Poll so a new like or message shows up without a manual refresh.
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/notifications/unread", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const body = (await res.json()) as { hasUnread: boolean };
        if (!cancelled) setHasUnread(body.hasUnread);
      } catch {
        // Transient network failure — the next tick retries.
      }
    }

    const timer = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex flex-col items-center gap-1 py-2.5 transition-colors",
                  active ? "text-brand" : "text-ink/60 hover:text-ink",
                )}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  {href === "/notifications" && hasUnread ? (
                    <span
                      aria-label="New notifications"
                      className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white"
                    />
                  ) : null}
                </span>
                <span className="stat text-[10px] font-semibold uppercase tracking-[0.1em]">
                  {label}
                </span>
                {active ? (
                  <span className="absolute inset-x-5 top-0 h-0.5 rounded-b bg-brand" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
