# TrainWithMe

Local sports-partner-finding app. MVP covers 4 sports (jiu-jitsu, running,
tennis, lifting): weekly events for all four, full "Find a Partner" matching
for jiu-jitsu only.

## Stack

- Next.js 15 (App Router, React 19) on Vercel
- Postgres via Prisma 7 (driver adapters — `@prisma/adapter-pg`)
- Auth.js (NextAuth v5, beta) — JWT sessions, credentials + optional Google/Apple
- Vercel Blob for profile photos (optional — app works without it)
- Chat: polling every 4s against a small REST route, no external chat service
- Geocoding: Zippopotam.us by default, or Google Geocoding API if you set a key

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
| `ADMIN_TOKEN` | `/admin/review` shows an instruction page instead of the queue. |
| `RESEND_API_KEY` | Unused — no MVP flow sends email yet. |

## Demo login

After `npm run db:seed`:

- `demo-alex@trainwithme.test` / `password123`
- `demo-sam@trainwithme.test` / `password123`
- `demo-jordan@trainwithme.test` / `password123`

All three are opted into jiu-jitsu matching near zip `98101`, so logging in
as one shows the other two in the thumbs deck.

## How the pieces map to the spec

- **Data model** — `prisma/schema.prisma`. One addition beyond the spec's
  table list: a `passes` table. It's required by the explicit "you've run out
  of people, see the list again" behavior (thumbs-down has to be tracked
  *somewhere* to know who to re-surface), and it's internal plumbing — never
  named in UI copy.
- **Terminology** (§3) — centralized in `src/lib/sports.ts` (match phrases,
  "Find a Partner" section label) and `src/lib/enums.ts` (belt/age labels).
  Icons for thumbs up/down have no text labels, per spec.
- **Matching logic** — `src/lib/matching.ts`. Distance-only ordering, computed
  server-side (`src/lib/distance.ts`), never serialized to the client
  (`src/lib/deck.ts` strips it before the profile reaches a Client Component).
- **Cross-sport visibility on match** — `src/lib/profiles.ts`'s
  `getVisibleProfile`.
- **Auto-hide + review queue** — `src/lib/visibility.ts` (threshold = 3,
  `AUTO_HIDE_REPORT_THRESHOLD`) and `/admin/review` (gated by `ADMIN_TOKEN`,
  intentionally bare-bones per §7).
- **Invite-a-friend** — `src/components/invite-friend.tsx` + `src/lib/invite.ts`.
  Pure client-side deep links (`sms:?&body=`, `wa.me`); no server route
  involved, matching the "client-side only" MVP scope.
- **Match celebration** — `src/components/match-celebration.tsx` +
  the `.twm-*` keyframes in `globals.css`.

## Known gaps (explicitly out of MVP scope, per the spec's §7)

- No matching for running/tennis/lifting yet — those sports get events +
  invite-a-friend only, exactly as specified.
- No server-initiated SMS — Twilio is not wired up; invite-a-friend is
  client-side only.
- No email sending — Resend dependency is installed but unused; nothing in
  the MVP flow requires it yet.
- Admin review queue is a single unauthenticated-by-token page, not a real
  admin panel or role system.

## Middleware note

`src/middleware.ts` builds its own minimal NextAuth instance from
`src/lib/auth.config.ts` (no providers) rather than importing `src/lib/auth.ts`
directly. Next's Edge runtime can't bundle Prisma or bcrypt (they need
`node:crypto`), so the full auth config — providers, the Prisma-backed
`jwt` callback — is kept out of anything that runs at the Edge. Route
handlers and Server Components/Actions use the full `auth()` from
`src/lib/auth.ts`, which runs on the Node.js runtime and has no such
restriction.
