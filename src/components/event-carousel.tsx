import { Badge } from "./ui";

export type EventCardData = {
  id: string;
  name: string;
  locationText: string;
  eventDate: Date;
  startTime: string;
  expectedSize: string | null;
  rsvpUrl: string | null;
  memberSubmitted: boolean;
};

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** "18:30" -> "6:30 PM"; anything else passes through untouched. */
function formatTime(startTime: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(startTime.trim());
  if (!match) return startTime;

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${period}`;
}

export function EventCarousel({ events }: { events: EventCardData[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-turf/25 bg-white px-4 py-5 text-center">
        <p className="text-sm text-ink/60">
          No events on the calendar yet. Know one? Add it above.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
      style={{ scrollbarWidth: "thin" }}
    >
      {events.map((event) => (
        <li
          key={event.id}
          className="flex min-h-[118px] w-[230px] shrink-0 snap-start flex-col justify-between rounded-card border border-chalk-line bg-white px-3 py-2.5"
        >
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-[15px] font-bold leading-tight text-ink">
                {event.name}
              </p>
              {event.memberSubmitted ? <Badge tone="muted">Member</Badge> : null}
            </div>
            <p className="mt-0.5 truncate text-xs text-ink/60">{event.locationText}</p>
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="stat text-[11px] font-semibold uppercase tracking-[0.08em] text-turf">
                {formatDay(event.eventDate)} · {formatTime(event.startTime)}
              </p>
              {event.expectedSize ? (
                <p className="stat text-[10px] uppercase tracking-[0.1em] text-ink/45">
                  ~{event.expectedSize} people
                </p>
              ) : null}
            </div>

            {event.rsvpUrl ? (
              <a
                href={event.rsvpUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="shrink-0 rounded bg-cone px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-cone/90"
              >
                RSVP
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
