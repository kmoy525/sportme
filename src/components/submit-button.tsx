"use client";

import { useFormStatus } from "react-dom";

import { buttonClass } from "./ui";

type Props = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: Parameters<typeof buttonClass>[0] extends undefined
    ? never
    : NonNullable<Parameters<typeof buttonClass>[0]>["variant"];
  size?: NonNullable<Parameters<typeof buttonClass>[0]>["size"];
  full?: boolean;
  className?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  size = "md",
  full = true,
  className,
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={buttonClass({ variant, size, full, className })}
    >
      {pending ? (pendingLabel ?? "Working…") : children}
    </button>
  );
}
