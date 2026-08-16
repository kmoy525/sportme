import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BoltIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui";
import { getAccount } from "@/lib/session";
import { SPORT_META, SPORTS } from "@/lib/sports";

export const metadata: Metadata = {
  title: "SportMe — Workouts are better together",
  description:
    "Find people to work out with, by sport. Join weekly meetups or match one-on-one for running, Brazilian Jiu Jitsu, tennis, lifting, and more.",
};

export default async function LandingPage() {
  const account = await getAccount();
  if (account?.profile) redirect("/home");

  return (
    <div className="bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2 text-ink">
          <BoltIcon className="h-6 w-6 text-brand" />
          <span className="display text-xl tracking-wide">SportMe</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold text-ink/70 hover:text-ink"
        >
          Log in
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-8 text-center sm:pb-16 sm:pt-14">
        <h1 className="display text-5xl leading-[0.95] text-ink sm:text-7xl">
          Workouts are better together.
        </h1>
        <div className="mt-8 flex justify-center">
          <Link href="/signup" className={buttonClass({ size: "lg" })}>
            Create Your Account
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-xl text-lg text-ink/70">
          From running to Brazilian Jiu Jitsu, find people to work out with.
        </p>
      </section>

      {/* One photo per sport */}
      <section aria-label="Sports on SportMe" className="mx-auto max-w-5xl px-5">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SPORTS.map((slug) => {
            const meta = SPORT_META[slug];
            return (
              <li
                key={slug}
                className="relative aspect-[3/4] overflow-hidden rounded-card bg-ink"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.imageUrl}
                  alt={meta.label}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <span className="stat absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                  {meta.label}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Two paths: group or one-on-one */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-card border border-ink/10 p-8">
            <h2 className="display text-2xl text-ink">Join a group</h2>
            <p className="mt-3 text-ink/70">
              Find weekly meetups and groups already happening nearby for your sport.
            </p>
          </div>
          <div className="rounded-card border border-ink/10 p-8">
            <h2 className="display text-2xl text-ink">Match one-on-one</h2>
            <p className="mt-3 text-ink/70">
              Swipe through people nearby who play your sport. Match, message, and set
              up your first workout.
            </p>
          </div>
        </div>
      </section>

      {/* Why SportMe */}
      <section className="bg-ink px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="stat text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            Why SportMe
          </h2>
          <ul className="mt-6 space-y-6">
            <li className="text-xl text-white sm:text-2xl">
              All sports, big or small. Starting with running, BJJ, tennis, and lifting,
              with more sports coming soon.
            </li>
            <li className="text-xl text-white sm:text-2xl">
              Whether you want one partner or a whole group, find the people you can
              work out with.
            </li>
            <li className="text-xl text-white sm:text-2xl">
              For anyone starting fresh, new to the area, or just tired of working out
              alone.
            </li>
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-2xl px-5 py-16 text-center sm:py-24">
        <h2 className="display text-4xl text-ink sm:text-5xl">
          Find your next workout partner
        </h2>
        <div className="mt-8 flex justify-center">
          <Link href="/signup" className={buttonClass({ size: "lg" })}>
            Create Your Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink/10 px-5 py-8 text-center text-xs text-ink/50">
        <Link href="/terms" className="hover:text-ink">
          Terms of Service
        </Link>
      </footer>
    </div>
  );
}
