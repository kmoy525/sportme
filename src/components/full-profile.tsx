import Link from "next/link";

import type { VisibleProfile } from "@/lib/profiles";
import { ageRangeLabel } from "@/lib/enums";
import { sportLabel } from "@/lib/sports";

import { FlagIcon } from "./icons";
import { ProfilePhoto } from "./profile-card";
import { SportStats } from "./sport-stats";
import { Card } from "./ui";

export function FullProfile({ profile }: { profile: VisibleProfile }) {
  return (
    <div className="space-y-3">
      <Card className="flex items-start gap-4 px-4 py-4">
        <ProfilePhoto photoUrl={profile.photoUrl} name={profile.name} />
        <div className="min-w-0 flex-1">
          <h2 className="display truncate text-3xl text-ink">{profile.name}</h2>
          <p className="stat text-[11px] uppercase tracking-[0.12em] text-ink/50">
            {ageRangeLabel(profile.ageRange)}
          </p>
        </div>
      </Card>

      {profile.sportProfiles.map((sp) => {
        const hasStats = sp.bjj || sp.running || sp.tennis || sp.lifting;
        return (
          <Card key={sp.sport} className="px-4 py-4">
            <h3 className="stat mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
              {sportLabel(sp.sport)}
            </h3>

            {hasStats || sp.description ? (
              <SportStats data={sp} />
            ) : (
              <p className="text-sm text-ink/55">
                Training {sportLabel(sp.sport).toLowerCase()}.
              </p>
            )}
          </Card>
        );
      })}

      {/* Report must be reachable from anywhere a profile is visible. */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <Link
          href={`/report/${profile.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition-colors hover:text-red-700"
        >
          <FlagIcon className="h-3.5 w-3.5" />
          Report or block
        </Link>
      </div>
    </div>
  );
}
