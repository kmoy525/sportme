import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cone";

const buttonVariants = {
  primary: "bg-cone text-white hover:bg-cone/90 active:bg-cone/80",
  turf: "bg-turf text-chalk hover:bg-turf-dark",
  outline:
    "border-2 border-turf/25 bg-white text-turf hover:border-turf/50 hover:bg-turf/5",
  ghost: "text-turf hover:bg-turf/10",
  danger: "border-2 border-red-200 bg-white text-red-700 hover:bg-red-50",
} as const;

const buttonSizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-[15px]",
  lg: "h-13 px-5 text-base",
} as const;

type ButtonStyleProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  full?: boolean;
};

export function buttonClass({
  variant = "primary",
  size = "md",
  full = false,
  className,
}: ButtonStyleProps & { className?: string } = {}) {
  return cx(
    buttonBase,
    buttonVariants[variant],
    buttonSizes[size],
    full && "w-full",
    className,
  );
}

export function Button({
  variant,
  size,
  full,
  className,
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      {...props}
      className={buttonClass({ variant, size, full, className })}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  full,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link {...props} className={buttonClass({ variant, size, full, className })} />;
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-card border border-chalk-line bg-white shadow-[0_1px_0_rgba(20,20,20,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small all-caps section heading with a rule, like a scoreboard label. */
export function SectionHeading({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="display text-xl text-turf">{children}</h2>
      {action}
    </div>
  );
}

/** Monospace stat readout: LABEL followed by a value. */
export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="stat text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">
        {label}
      </span>
      <span className="stat text-[15px] font-semibold text-ink">{value}</span>
    </div>
  );
}

export function Badge({
  children,
  tone = "scoreboard",
}: {
  children: ReactNode;
  tone?: "scoreboard" | "turf" | "muted";
}) {
  const tones = {
    scoreboard: "bg-scoreboard text-ink",
    turf: "bg-turf text-chalk",
    muted: "bg-turf/10 text-turf",
  } as const;
  return (
    <span
      className={cx(
        "stat inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && !error ? (
        <span className="mt-1 block text-xs text-ink/55">{hint}</span>
      ) : null}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-red-700">{error}</span>
      ) : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-turf/20 bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-ink/35 focus:border-turf focus:outline-none focus:ring-2 focus:ring-turf/15";

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800"
    >
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="px-5 py-8 text-center">
      <p className="display text-lg text-turf">{title}</p>
      {body ? <p className="mx-auto mt-2 max-w-xs text-sm text-ink/65">{body}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </Card>
  );
}
