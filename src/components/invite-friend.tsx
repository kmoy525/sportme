"use client";

import { buttonClass } from "./ui";

/**
 * Client-side only — no backend. Opens the member's own Messages or WhatsApp
 * with an empty recipient field and the text pre-pasted, sent from their number.
 */
export function inviteHrefs(message: string) {
  const encoded = encodeURIComponent(message);
  return {
    // The `?&body=` form is what iOS Messages needs to pre-fill with no recipient.
    sms: `sms:?&body=${encoded}`,
    whatsapp: `https://wa.me/?text=${encoded}`,
  };
}

export function InviteFriendLink({ message }: { message: string }) {
  const { sms } = inviteHrefs(message);

  return (
    <a
      href={sms}
      className="flex items-center justify-between rounded-card border border-dashed border-ink/30 bg-white px-4 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/60 hover:bg-ink/5"
    >
      Know someone who trains? Invite a friend
      <span aria-hidden className="text-brand">
        →
      </span>
    </a>
  );
}

export function InviteFriendButtons({ message }: { message: string }) {
  const { sms, whatsapp } = inviteHrefs(message);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <a href={sms} className={buttonClass({ variant: "primary", full: true })}>
        Invite by text
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        className={buttonClass({ variant: "outline", full: true })}
      >
        Invite on WhatsApp
      </a>
    </div>
  );
}
