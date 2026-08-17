"use client";

import { useState, useTransition } from "react";

import { respondMeetupCheckAction } from "@/lib/actions/chat-actions";

import { ThumbDownIcon, ThumbUpIcon } from "./icons";

/** "Did you work out together?" prompt — shown once per chat, per isMeetupCheckDue. */
export function MeetupCheckModal({
  chatId,
  partnerName,
  due,
}: {
  chatId: string;
  partnerName: string;
  due: boolean;
}) {
  const [open, setOpen] = useState(due);
  const [pending, startTransition] = useTransition();

  if (!open) return null;

  function respond(workedOut: boolean) {
    startTransition(async () => {
      await respondMeetupCheckAction(chatId, workedOut);
      setOpen(false);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl">
        <p className="display text-xl text-ink">
          Did you and {partnerName} work out together?
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            disabled={pending}
            onClick={() => respond(true)}
            aria-label="Yes, we worked out together"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
          >
            <ThumbUpIcon className="h-7 w-7" />
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => respond(false)}
            aria-label="No, we didn't work out together"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink/5 disabled:opacity-50"
          >
            <ThumbDownIcon className="h-7 w-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
