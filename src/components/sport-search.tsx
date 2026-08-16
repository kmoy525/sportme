"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { requestSportAction } from "@/lib/actions/event-actions";
import { emptyFormState, fieldError } from "@/lib/form";
import { SPORT_META, SPORTS, searchSports, type SportSlug } from "@/lib/sports";

import { ChevronRightIcon, SearchIcon } from "./icons";
import { SubmitButton } from "./submit-button";
import { Badge, Card, FormError, inputClass } from "./ui";

type SportCardData = {
  slug: SportSlug;
  joined: boolean;
  eventCount: number;
};

export function SportSearch({ sports }: { sports: SportCardData[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sports;

    const hit = searchSports(q);
    return sports.filter(
      (s) => s.slug === hit || SPORT_META[s.slug].label.toLowerCase().includes(q),
    );
  }, [query, sports]);

  const noResults = query.trim().length > 0 && visible.length === 0;

  return (
    <div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a sport…"
          aria-label="Search a sport"
          className={`${inputClass} pl-10`}
        />
      </div>

      {noResults ? (
        <SportRequest query={query} />
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((sport) => (
            <li key={sport.slug}>
              <SportCard {...sport} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SportCard({ slug, joined, eventCount }: SportCardData) {
  const meta = SPORT_META[slug];

  return (
    <Link href={`/sports/${slug}`} className="block">
      <Card className="flex items-center gap-3 overflow-hidden py-3 pl-3 pr-4 transition-colors hover:border-ink/25">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.imageUrl}
          alt=""
          aria-hidden
          className="h-14 w-14 shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="display truncate text-2xl text-ink">{meta.label}</h3>
            {joined ? <Badge tone="muted">Joined</Badge> : null}
          </div>
          <p className="stat mt-1 text-[11px] uppercase tracking-[0.1em] text-ink/50">
            {eventCount > 0
              ? `${eventCount} upcoming ${eventCount === 1 ? "event" : "events"}`
              : "No events yet"}
            {meta.matchingEnabled ? " · Find a partner" : ""}
          </p>
        </div>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink/30" />
      </Card>
    </Link>
  );
}

function SportRequest({ query }: { query: string }) {
  const [state, action] = useActionState(requestSportAction, emptyFormState);

  if (state.success) {
    return (
      <Card className="mt-4 px-5 py-6 text-center">
        <p className="display text-lg text-ink">Got it — request sent</p>
        <p className="mt-2 text-sm text-ink/65">
          We&apos;ll let you know if it opens up near you.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mt-4 px-5 py-6">
      <p className="display text-lg text-ink">
        We don&apos;t have that sport yet — want to request it?
      </p>
      <form action={action} className="mt-4 space-y-3">
        <FormError>{state.error}</FormError>
        <input
          name="sportName"
          type="text"
          required
          defaultValue={query}
          key={query}
          aria-label="Sport you want"
          placeholder="Which sport?"
          className={inputClass}
        />
        {fieldError(state, "sportName") ? (
          <p className="text-xs font-medium text-red-700">
            {fieldError(state, "sportName")}
          </p>
        ) : null}
        <SubmitButton pendingLabel="Sending…">Request this sport</SubmitButton>
      </form>
      <p className="mt-4 text-center text-xs text-ink/50">
        Meanwhile:{" "}
        {SPORTS.map((s, i) => (
          <span key={s}>
            {i > 0 ? " · " : ""}
            <Link href={`/sports/${s}`} className="font-semibold text-ink underline">
              {SPORT_META[s].label}
            </Link>
          </span>
        ))}
      </p>
    </Card>
  );
}
