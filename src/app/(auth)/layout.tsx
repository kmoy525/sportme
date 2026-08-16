import Link from "next/link";

import { BoltIcon } from "@/components/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-chalk">
      <header className="bg-turf px-5 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-chalk">
          <BoltIcon className="h-6 w-6 text-scoreboard" />
          <span className="display text-2xl tracking-wide">TrainWithMe</span>
        </Link>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-8">{children}</main>
      <footer className="mx-auto w-full max-w-md px-5 pb-8 text-xs text-ink/50">
        Find local training partners and weekly events.
      </footer>
    </div>
  );
}
