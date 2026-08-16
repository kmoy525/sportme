"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { respondToLikesAction } from "@/lib/actions/match-actions";
import { matchPhrase as phraseForSport } from "@/lib/sports";

import { ThumbDownIcon, ThumbUpIcon } from "./icons";
import { MatchCelebration } from "./match-celebration";
import { FormError } from "./ui";

type Celebration = { phrase: string; partnerName: string; chatId: string };

/**
 * Same thumbs mechanic as the deck, for someone who already wants to train
 * with you. Answers every sport they thumbed you up in.
 */
export function RespondToLike({
  profileId,
  sports,
}: {
  profileId: string;
  sports: string[];
}) {
  const router = useRouter();
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  function respond(liked: boolean) {
    if (pending) return;
    setError(undefined);

    startTransition(async () => {
      const result = await respondToLikesAction(profileId, sports, liked);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.matched) {
        setCelebration({
          phrase: phraseForSport(result.matched.sport as never),
          partnerName: result.matched.partnerName,
          chatId: result.matched.chatId,
        });
        return;
      }
      router.push("/notifications");
    });
  }

  if (celebration) {
    return (
      <MatchCelebration
        phrase={celebration.phrase}
        partnerName={celebration.partnerName}
        chatId={celebration.chatId}
      />
    );
  }

  return (
    <div>
      <FormError>{error}</FormError>
      <div className="mt-2 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => respond(false)}
          disabled={pending}
          aria-label="Pass"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-turf/20 bg-white text-turf/60 transition-colors hover:border-turf/40 hover:text-turf active:scale-95 disabled:opacity-50"
        >
          <ThumbDownIcon className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={() => respond(true)}
          disabled={pending}
          aria-label="Train with them"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-cone text-white shadow-[0_4px_0_rgba(20,20,20,0.15)] transition-transform hover:bg-cone/90 active:scale-95 disabled:opacity-50"
        >
          <ThumbUpIcon className="h-9 w-9" />
        </button>
      </div>
    </div>
  );
}
