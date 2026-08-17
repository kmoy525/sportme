/**
 * The invite message body. Client-side deep link only — no server ever sends
 * this, it opens the member's own Messages/WhatsApp with the text pre-pasted.
 */
export function appUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // The project's assigned production domain — correct even when the
  // current build is a specific deployment with its own unique hash URL.
  const production = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  // Preview deployments have no single "production domain," so their own
  // per-build URL is the best available fallback.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/** @param smsPhrase A sport's `SPORT_META[...].smsPhrase`, e.g. "run with", "play tennis with". */
export function inviteMessage(smsPhrase: string): string {
  return `Hey! I found this app to ${smsPhrase} (and other sports). Check it out: ${appUrl()}`;
}
