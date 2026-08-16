# SportMe

A website (mobile-responsive, not framed as an installable app) for finding
people to work out with — by sport. Public landing page at `/`; a signed-in
member gets weekly events plus one-on-one matching, for jiu-jitsu, running,
tennis, and lifting.

## Stack

- Next.js 15 (App Router, React 19) on Vercel
- Postgres via Prisma 7 (driver adapters — `@prisma/adapter-pg`)
- Auth.js (NextAuth v5, beta) — JWT sessions, credentials + optional Google/Apple
- Vercel Blob for profile photos
- Google Places Autocomplete for event location entry (falls back to a plain
  address + zip field without a key), plus a Maps Embed on the event detail page
- Chat: polling every 4s against a small REST route, no external chat service
- Geocoding: Zippopotam.us by default, or Google Geocoding API if you set a key
- Fonts: Sora (headlines, via next/font/google) and General Sans (body, via
  Fontshare's CDN — not on Google Fonts)

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL at minimum
npm run db:migrate     # applies prisma/migrations
npm run db:seed        # optional: a few demo BJJ profiles + curated events
npm run dev
```

No Postgres handy? `npx prisma dev` spins up a local Postgres with zero
Docker/install — point `DATABASE_URL` at the connection string it prints and
you're running end-to-end in under a minute.

### Required env vars

- `DATABASE_URL` — Postgres connection string.
- `AUTH_SECRET` — generate with `npx auth secret`.

Everything else in `.env.example` is optional and the app degrades
gracefully without it:

| Missing var | What happens |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Photo upload silently skipped; app works without photos. |
| `AUTH_GOOGLE_ID`/`AUTH_APPLE_ID` | Those OAuth buttons just don't render; email/phone + password still works. |
| `GOOGLE_GEOCODING_API_KEY` | Falls back to Zippopotam.us (US zips only, no key needed). |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Event location falls back to a plain address + zip text field; no map on the event detail page. |
| `ADMIN_TOKEN` | `/admin/review` shows an instruction page instead of the queue. |
| `RESEND_API_KEY` | Unused — no flow sends email yet. |

## Demo login

After `npm run db:seed`:

- `demo-alex@sportme.test` / `password123`
- `demo-sam@sportme.test` / `password123`
- `demo-jordan@sportme.test` / `password123`

All three are opted into jiu-jitsu matching near zip `98101`, so logging in
as one shows the other two in the thumbs deck.

## Route map

- `/` — public landing page (server-rendered, meta title/description set for
  search/AI answer engines). Signed-in members with a completed profile are
  redirected to `/home`.
- `/home` — the signed-in homepage (sport search + cards). Was `/` before the
  landing page existed.
- `/sports/[sport]` — events carousel + Find a Partner, for all four sports.
- `/events/[eventId]`, `/events/[eventId]/edit` — event detail and edit;
  editing is restricted server-side to the member who created the event.
  Admin-curated events (`created_by_profile_id` null) are never user-editable.

## How the pieces map to the spec

- **Data model** — `prisma/schema.prisma`. One addition beyond the original
  spec's table list: a `passes` table, needed to track who to re-surface for
  "you've run out of people, see the list again" — internal plumbing, never
  named in UI copy. A `chat_reads` table and `profiles.notifications_viewed_at`
  drive the Notifications nav badge.
- **Matching** — enabled for all four sports. Jiu-jitsu has sport-specific
  fields (belt, gym, weight class); the other three just have a plain opt-in
  toggle with no extra fields, per `src/lib/actions/sport-actions.ts`.
- **Matching logic** — `src/lib/matching.ts`. Distance-only ordering, computed
  server-side (`src/lib/distance.ts`), never serialized to the client
  (`src/lib/deck.ts` strips it before the profile reaches a Client Component).
- **Cross-sport visibility on match** — `src/lib/profiles.ts`'s
  `getVisibleProfile`.
- **Auto-hide + review queue** — `src/lib/visibility.ts` (threshold = 3,
  `AUTO_HIDE_REPORT_THRESHOLD`) and `/admin/review` (gated by `ADMIN_TOKEN`).
- **Invite-a-friend** — `src/components/invite-friend.tsx` + `src/lib/invite.ts`.
  Pure client-side deep links (`sms:?&body=`, `wa.me`); no server route
  involved.
- **Match celebration** — `src/components/match-celebration.tsx` +
  the `.twm-*` keyframes in `globals.css`. Full-screen coral-red flash.
- **Notifications badge** — `src/lib/notifications.ts`'s
  `hasUnreadNotifications`/`markNotificationsViewed`/`markChatRead`. A single
  dot on the nav icon for either an unread like (since the tab was last
  opened) or an unread chat message (since that chat was last opened).

## Design system

White background, charcoal (`#262626`) text, coral-red (`#ff4754`) accent,
pill-shaped buttons/badges/cards. Centralized in `src/components/ui.tsx` and
`src/app/globals.css` — most visual changes only touch those two files.

## Middleware note

`src/middleware.ts` builds its own minimal NextAuth instance from
`src/lib/auth.config.ts` (no providers) rather than importing `src/lib/auth.ts`
directly. Next's Edge runtime can't bundle Prisma or bcrypt (they need
`node:crypto`), so the full auth config — providers, the Prisma-backed
`jwt` callback — is kept out of anything that runs at the Edge. Route
handlers and Server Components/Actions use the full `auth()` from
`src/lib/auth.ts`, which runs on the Node.js runtime and has no such
restriction.
