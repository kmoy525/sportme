"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BellIcon, HomeIcon, PersonIcon } from "./icons";
import { cx } from "./ui";

const TABS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/notifications", label: "Notifications", Icon: BellIcon },
  { href: "/profile", label: "Profile", Icon: PersonIcon },
] as const;

export function BottomNav({ notificationCount }: { notificationCount: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-turf-line bg-turf pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex flex-col items-center gap-1 py-2.5 transition-colors",
                  active ? "text-scoreboard" : "text-chalk/60 hover:text-chalk",
                )}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  {href === "/notifications" && notificationCount > 0 ? (
                    <span
                      className="stat absolute -right-2.5 -top-1.5 min-w-[18px] rounded-full bg-cone px-1 text-center text-[10px] font-semibold leading-[18px] text-white"
                      aria-label={`${notificationCount} new`}
                    >
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  ) : null}
                </span>
                <span className="stat text-[10px] font-semibold uppercase tracking-[0.1em]">
                  {label}
                </span>
                {active ? (
                  <span className="absolute inset-x-5 top-0 h-0.5 rounded-b bg-scoreboard" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
