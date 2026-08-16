import type { BjjStats, LiftingStats, RunningStats, TennisStats } from "@/lib/matching";
import {
  beltLabel,
  beltSwatch,
  gymMembershipLabel,
  liftingGoalLabel,
  liftingProgramLabel,
  ntrpLabel,
  paceLabel,
  runningRaceDistanceLabel,
  runningTypicalDistanceLabel,
  sessionLengthLabel,
  tennisPreferenceLabel,
  tennisStyleLabel,
  weightClassLabel,
} from "@/lib/enums";

import { Badge, Stat } from "./ui";

export type SportStatsData = {
  description?: string | null;
  bjj: BjjStats | null;
  running: RunningStats | null;
  tennis: TennisStats | null;
  lifting: LiftingStats | null;
};

/**
 * Renders whichever sport-specific stat block applies — at most one of
 * bjj/running/tennis/lifting is ever non-null for a given sport profile.
 */
export function SportStats({ data }: { data: SportStatsData }) {
  return (
    <>
      {data.bjj ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-4 w-4 rounded-full border border-ink/20"
              style={{ background: beltSwatch(data.bjj.belt) }}
            />
            <Stat label="Belt" value={beltLabel(data.bjj.belt)} />
          </div>
          <Stat label="Gym" value={data.bjj.gym || "—"} />
          {data.bjj.weightClass ? (
            <div className="col-span-2">
              <Badge tone="muted">{weightClassLabel(data.bjj.weightClass)}</Badge>
            </div>
          ) : null}
        </div>
      ) : null}

      {data.running ? (
        <div className="flex flex-wrap gap-2">
          {data.running.paceSecondsPerMile ? (
            <Badge tone="muted">{paceLabel(data.running.paceSecondsPerMile)}</Badge>
          ) : null}
          {data.running.trainingFor ? (
            <Badge tone="muted">
              Training for {runningRaceDistanceLabel(data.running.trainingFor)}
            </Badge>
          ) : null}
          {data.running.typicalDistance ? (
            <Badge tone="muted">
              Usually runs {runningTypicalDistanceLabel(data.running.typicalDistance)}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {data.tennis ? (
        <div className="flex flex-wrap gap-2">
          {data.tennis.ntrp !== null ? (
            <Badge tone="muted">NTRP {ntrpLabel(data.tennis.ntrp)}</Badge>
          ) : null}
          {data.tennis.style ? (
            <Badge tone="muted">{tennisStyleLabel(data.tennis.style)}</Badge>
          ) : null}
          {data.tennis.preference ? (
            <Badge tone="muted">{tennisPreferenceLabel(data.tennis.preference)}</Badge>
          ) : null}
        </div>
      ) : null}

      {data.lifting ? (
        <div className="flex flex-wrap gap-2">
          {data.lifting.program ? (
            <Badge tone="muted">{liftingProgramLabel(data.lifting.program)}</Badge>
          ) : null}
          {data.lifting.goal ? (
            <Badge tone="muted">{liftingGoalLabel(data.lifting.goal)}</Badge>
          ) : null}
          {data.lifting.sessionLength ? (
            <Badge tone="muted">{sessionLengthLabel(data.lifting.sessionLength)} sessions</Badge>
          ) : null}
          {data.lifting.gymMembership ? (
            <Badge tone="muted">{gymMembershipLabel(data.lifting.gymMembership)}</Badge>
          ) : null}
        </div>
      ) : null}

      {data.description ? (
        <p className="mt-3 text-sm text-ink/70">{data.description}</p>
      ) : null}
    </>
  );
}
