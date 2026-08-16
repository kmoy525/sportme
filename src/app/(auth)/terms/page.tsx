import Link from "next/link";

export const metadata = { title: "Terms of Service · SportMe" };

/**
 * Placeholder. Replace with counsel-reviewed terms before launch — the signup
 * gate already links here and records acceptance on the account.
 */
export default function TermsPage() {
  return (
    <article className="space-y-4 text-sm leading-relaxed text-ink/80">
      <h1 className="display text-3xl text-ink">Terms of Service</h1>

      <p className="rounded-2xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-xs font-semibold text-ink">
        Placeholder text — replace before launch.
      </p>

      <h2 className="display pt-2 text-lg text-ink">Who can use SportMe</h2>
      <p>
        You must be 18 or older to create an account. You confirm your age at signup,
        and we record the date you accepted these terms.
      </p>

      <h2 className="display pt-2 text-lg text-ink">How you treat other members</h2>
      <p>
        SportMe exists to connect training partners. Harassment, misrepresenting who
        you are, and inappropriate photos are not allowed. You can report or block any
        member from anywhere their profile appears.
      </p>

      <h2 className="display pt-2 text-lg text-ink">Training is at your own risk</h2>
      <p>
        We do not vet, screen, or background-check members, and we do not supervise
        training. Meeting and training with anyone you find here is entirely at your own
        risk. Meet in public, at a gym, or somewhere you feel safe.
      </p>

      <h2 className="display pt-2 text-lg text-ink">Events</h2>
      <p>
        Events are either curated by us or submitted by members. We do not organize,
        run, or vouch for them, and links go to third-party sites we do not control.
      </p>

      <p className="pt-4">
        <Link href="/signup" className="font-semibold text-ink underline">
          Back to signup
        </Link>
      </p>
    </article>
  );
}
