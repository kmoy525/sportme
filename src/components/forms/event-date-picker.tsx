"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { inputClass } from "@/components/ui";

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromISODate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const [, y, m, d] = match;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

/** Date field for the event form, backed by react-day-picker in a popover. */
export function EventDatePicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const selected = fromISODate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} text-left`}
      >
        {selected
          ? selected.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Pick a date"}
      </button>

      {open ? (
        <div className="absolute z-20 mt-2 rounded-2xl border border-ink/10 bg-white p-2 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected ?? today}
            disabled={{ before: today }}
            onSelect={(date) => {
              if (!date) return;
              setValue(toISODate(date));
              setOpen(false);
            }}
            classNames={{
              today: "text-brand font-semibold",
              selected: "bg-brand text-white rounded-full",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
