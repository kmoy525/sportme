import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const buttonVariants = {
  primary: "bg-brand text-white hover:bg-brand/90 active:bg-brand/80",
  outline:
    "border-2 border-ink/15 bg-white text-ink hover:border-ink/30 hover:bg-ink/5",
  ghost: "text-ink hover:bg-ink/5",
  danger: "border-2 border-red-200 bg-white text-red-700 hover:bg-red-50",
} as const;

const buttonSizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-6 text-base",
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
        "rounded-card border border-ink/10 bg-white shadow-[0_1px_0_rgba(38,38,38,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small heading with a trailing action slot. */
export function SectionHeading({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="display text-xl text-ink">{children}</h2>
      {action}
    </div>
  );
}

/** Small label-over-value readout, e.g. belt, gym. */
export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="stat text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">
        {label}
      </span>
      <span className="text-[15px] font-semibold text-ink">{value}</span>
    </div>
  );
}

export function Badge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "muted";
}) {
  const tones = {
    brand: "bg-brand/10 text-brand",
    muted: "bg-ink/[0.06] text-ink/70",
  } as const;
  return (
    <span
      className={cx(
        "stat inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
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
  "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-ink/35 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800"
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
      <p className="display text-lg text-ink">{title}</p>
      {body ? <p className="mx-auto mt-2 max-w-xs text-sm text-ink/65">{body}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </Card>
  );
}
