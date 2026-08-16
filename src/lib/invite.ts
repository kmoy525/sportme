/**
 * The invite message body. Client-side deep link only — no server ever sends
 * this, it opens the member's own Messages/WhatsApp with the text pre-pasted.
 */
export function appUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export function inviteMessageFor(sportLabel: string, zipCode: string): string {
  return `Hey — found this app for finding ${sportLabel} partners near ${zipCode}. Check it out: ${appUrl()}`;
}
