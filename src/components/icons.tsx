type IconProps = { className?: string };

export function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.6 1.5 4 13.4h6.1L9.9 22.5l9.9-12.2h-6.4l.2-8.8Z" />
    </svg>
  );
}

export function ThumbUpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2 10.5h3.4V22H2a1 1 0 0 1-1-1V11.5a1 1 0 0 1 1-1Zm5.4 0 4.3-8.1a1.4 1.4 0 0 1 1.9-.6 3 3 0 0 1 1.5 3.2l-.7 3.4h5.2a2.4 2.4 0 0 1 2.35 2.9l-1.5 7.3A2.9 2.9 0 0 1 17.6 22H7.4V10.5Z" />
    </svg>
  );
}

export function ThumbDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22 13.5h-3.4V2H22a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1Zm-5.4 0-4.3 8.1a1.4 1.4 0 0 1-1.9.6 3 3 0 0 1-1.5-3.2l.7-3.4H4.4a2.4 2.4 0 0 1-2.35-2.9l1.5-7.3A2.9 2.9 0 0 1 6.4 2h10.2v11.5Z" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.6 1.8 11.1l1.3 1.55L4.5 11.5V21a1 1 0 0 0 1 1H9.5v-6h5v6h4a1 1 0 0 0 1-1v-9.5l1.4 1.15L22.2 11.1 12 2.6Z" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a6.5 6.5 0 0 0-6.5 6.5v3.6L3.3 16a1 1 0 0 0 .87 1.5h15.66A1 1 0 0 0 20.7 16l-2.2-3.9V8.5A6.5 6.5 0 0 0 12 2Zm0 20a3 3 0 0 0 2.83-2H9.17A3 3 0 0 0 12 22Z" />
    </svg>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 12.2a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 1.9c-4.6 0-8.4 2.6-8.4 5.8V22h16.8v-2.1c0-3.2-3.8-5.8-8.4-5.8Z" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4.5 4.5" />
    </svg>
  );
}

export function FlagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M5 2a1 1 0 0 1 1 1v.7l13.3 2.2a1 1 0 0 1 .53 1.73L15.9 11.4l3.93 3.77a1 1 0 0 1-.53 1.71L6 19.1V22H4V3a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

/** Variety of shapes — "any sport, big or small". */
export function ShapesIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="7" cy="7" r="4.5" />
      <rect x="13" y="2.5" width="9" height="9" rx="1.5" />
      <path d="M8 21.5h9L12.5 13Z" />
    </svg>
  );
}

/** Two people — "find a partner or a whole group". */
export function PeopleIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="9" cy="7" r="3.25" />
      <path d="M2.5 20.5c0-3.6 2.9-6.25 6.5-6.25s6.5 2.65 6.5 6.25" />
      <circle cx="17.5" cy="8" r="2.5" />
      <path d="M16 14.75c2.75.5 4.5 2.75 4.5 5.75" />
    </svg>
  );
}

/** Map pin — "wherever you're starting from". */
export function MapPinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12 21.5S4.5 14.9 4.5 9.5a7.5 7.5 0 0 1 15 0c0 5.4-7.5 12-7.5 12Z" />
      <circle cx="12" cy="9.5" r="2.75" />
    </svg>
  );
}
