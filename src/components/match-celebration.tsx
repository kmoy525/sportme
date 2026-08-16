"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BoltIcon } from "./icons";

const AUTO_ADVANCE_MS = 2400;

/**
 * The signature moment: full-screen lightning flash in amber/orange, the
 * sport-specific phrase animating in like a scoreboard readout, then straight
 * into the chat.
 */
export function MatchCelebration({
  phrase,
  partnerName,
  chatId,
}: {
  phrase: string;
  partnerName: string;
  chatId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/chats/${chatId}`);
    const timer = setTimeout(() => router.push(`/chats/${chatId}`), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [chatId, router]);

  const characters = [...phrase];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`New training partner: ${partnerName}`}
      onClick={() => router.push(`/chats/${chatId}`)}
      className="twm-flash fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-scoreboard px-6 text-center"
    >
      {/* Orange wash under the amber flash. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,107,53,0.85),rgba(255,107,53,0)_62%)]"
      />

      <div className="relative flex flex-col items-center">
        <BoltIcon className="twm-bolt h-28 w-28 text-ink drop-shadow-[0_6px_0_rgba(255,107,53,0.55)]" />

        <h1
          className="display mt-4 text-6xl leading-none text-ink"
          style={{ perspective: "600px" }}
        >
          {characters.map((char, i) => (
            <span
              key={`${char}-${i}`}
              className="twm-flip"
              style={{ animationDelay: `${420 + i * 45}ms` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </h1>

        <p
          className="twm-rise stat mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-ink/70"
          style={{ animationDelay: "900ms" }}
        >
          {partnerName} is your training partner
        </p>
        <p
          className="twm-rise mt-6 text-xs font-semibold text-ink/50"
          style={{ animationDelay: "1200ms" }}
        >
          Opening your chat…
        </p>
      </div>
    </div>
  );
}
