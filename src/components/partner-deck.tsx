"use client";

import { useEffect, useState, useTransition } from "react";

import { seeListAgainAction, thumbsDownAction, thumbsUpAction } from "@/lib/actions/match-actions";
import type { DeckProfile } from "@/lib/deck";

import { ThumbDownIcon, ThumbUpIcon } from "./icons";
import { InviteFriendButtons } from "./invite-friend";
import { MatchCelebration } from "./match-celebration";
import { ProfileCard } from "./profile-card";
import { Card, FormError } from "./ui";

type Celebration = { phrase: string; partnerName: string; chatId: string };

export function PartnerDeck({
  sport,
  matchPhrase,
  profiles,
  hadPasses,
  inviteMessage,
}: {
  sport: string;
  matchPhrase: string;
  profiles: DeckProfile[];
  hadPasses: boolean;
  inviteMessage: string;
}) {
  const [index, setIndex] = useState(0);
  const [passedHere, setPassedHere] = useState(false);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  // A fresh deck (e.g. after "see the list again") starts from the top.
  useEffect(() => {
    setIndex(0);
    setPassedHere(false);
  }, [profiles]);

  const current = profiles[index];

  function advance() {
    setIndex((i) => i + 1);
  }

  function onThumbsUp() {
    if (!current || pending) return;
    setError(undefined);
    const target = current;

    startTransition(async () => {
      const result = await thumbsUpAction(target.profileId, sport);
      if (!result.ok) {
        setError(result.error);
        advance();
        return;
      }
      if (result.outcome.matched) {
        setCelebration({
          phrase: matchPhrase,
          partnerName: result.outcome.partnerName,
          chatId: result.outcome.chatId,
        });
        return;
      }
      advance();
    });
  }

  function onThumbsDown() {
    if (!current || pending) return;
    setError(undefined);
    const target = current;
    setPassedHere(true);

    startTransition(async () => {
      const result = await thumbsDownAction(target.profileId, sport);
      if (!result.ok) setError(result.error);
      advance();
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

  if (!current) {
    // Anyone passed on is still out there — offer the list again before
    // falling back to the truly-empty state.
    if (hadPasses || passedHere) {
      return (
        <Card className="px-5 py-7 text-center">
          <p className="display text-lg text-turf">
            You&apos;ve run out of people, would you like to see the list again?
          </p>
          <form action={seeListAgainAction} className="mt-4">
            <input type="hidden" name="sport" value={sport} />
            <button
              type="submit"
              className="h-11 w-full rounded-md bg-cone px-4 text-[15px] font-semibold text-white transition-colors hover:bg-cone/90"
            >
              Show me the list again
            </button>
          </form>
          <div className="mt-4 border-t border-chalk-line pt-4">
            <p className="mb-3 text-sm text-ink/60">Or bring someone new in:</p>
            <InviteFriendButtons message={inviteMessage} />
          </div>
        </Card>
      );
    }

    return (
      <Card className="px-5 py-7 text-center">
        <p className="display text-lg text-turf">
          No one else nearby yet — invite a training partner to get things going
        </p>
        <div className="mt-4">
          <InviteFriendButtons message={inviteMessage} />
        </div>
      </Card>
    );
  }

  return (
    <div>
      <FormError>{error}</FormError>

      <div className={pending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        <ProfileCard profile={current} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onThumbsDown}
          disabled={pending}
          aria-label="Pass"
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-turf/20 bg-white text-turf/60 transition-colors hover:border-turf/40 hover:text-turf active:scale-95 disabled:opacity-50"
        >
          <ThumbDownIcon className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={onThumbsUp}
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
