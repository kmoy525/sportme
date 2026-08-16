import Link from "next/link";

import type { DeckProfile } from "@/lib/deck";
import { ageRangeLabel, beltLabel, beltSwatch, formatHeight, formatWeight } from "@/lib/enums";

import { FlagIcon } from "./icons";
import { Card, Stat } from "./ui";

/**
 * Small, corner-anchored photo — deliberately not full-bleed, to keep this
 * from reading looks-first.
 */
export function ProfilePhoto({
  photoUrl,
  name,
  size = "md",
}: {
  photoUrl: string | null;
  name: string;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-11 w-11" : "h-16 w-16";

  if (!photoUrl) {
    return (
      <div
        aria-hidden
        className={`${box} flex shrink-0 items-center justify-center rounded-md bg-turf text-chalk`}
      >
        <span className="display text-xl">{name.slice(0, 1).toUpperCase()}</span>
      </div>
    );
  }

  return (
    // Photos come from arbitrary blob hosts; plain <img> avoids remote-pattern config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photoUrl}
      alt={name}
      className={`${box} shrink-0 rounded-md object-cover`}
      loading="lazy"
    />
  );
}

export function ProfileCard({
  profile,
  footer,
}: {
  profile: DeckProfile;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 border-b border-chalk-line px-4 py-4">
        <ProfilePhoto photoUrl={profile.photoUrl} name={profile.name} />
        <div className="min-w-0 flex-1">
          <h3 className="display truncate text-2xl text-turf">{profile.name}</h3>
          <p className="stat text-[11px] uppercase tracking-[0.12em] text-ink/50">
            {ageRangeLabel(profile.ageRange)}
          </p>
        </div>
        <Link
          href={`/report/${profile.profileId}`}
          aria-label={`Report ${profile.name}`}
          title="Report"
          className="rounded p-1.5 text-ink/25 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <FlagIcon className="h-4 w-4" />
        </Link>
      </div>

      {profile.bjj ? (
        <div className="bg-turf/[0.04] px-4 py-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-4 w-4 rounded-sm border border-ink/20"
                style={{ background: beltSwatch(profile.bjj.belt) }}
              />
              <Stat label="Belt" value={beltLabel(profile.bjj.belt)} />
            </div>
            <Stat label="Gym" value={profile.bjj.gym || "—"} />
            <Stat label="Weight" value={formatWeight(profile.bjj.weight)} />
            <Stat label="Height" value={formatHeight(profile.bjj.heightIn)} />
          </div>
        </div>
      ) : null}

      {footer ? <div className="px-4 py-4">{footer}</div> : null}
    </Card>
  );
}
