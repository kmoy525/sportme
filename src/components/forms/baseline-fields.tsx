"use client";

import { useState } from "react";

import { Field, inputClass } from "@/components/ui";
import { TRAVEL_RADIUS_OPTIONS } from "@/lib/travel-radius";
import { AGE_RANGE_OPTIONS, PREFERRED_CONTACT_OPTIONS } from "@/lib/enums";
import type { FormState } from "@/lib/form";
import { fieldError } from "@/lib/form";

export type BaselineDefaults = {
  name?: string;
  ageRange?: string;
  zipCode?: string;
  travelRadiusMiles?: number;
  preferredContact?: string;
  photoUrl?: string | null;
};

export function BaselineFields({
  state,
  defaults = {},
  photoStorageConfigured,
}: {
  state: FormState;
  defaults?: BaselineDefaults;
  photoStorageConfigured: boolean;
}) {
  const initialRadiusIndex = Math.max(
    0,
    TRAVEL_RADIUS_OPTIONS.indexOf(
      (defaults.travelRadiusMiles ?? 25) as (typeof TRAVEL_RADIUS_OPTIONS)[number],
    ),
  );
  const [radiusIndex, setRadiusIndex] = useState(
    initialRadiusIndex === -1 ? 2 : initialRadiusIndex,
  );
  const radius = TRAVEL_RADIUS_OPTIONS[radiusIndex];

  return (
    <>
      <Field label="Name" error={fieldError(state, "name")}>
        <input
          name="name"
          type="text"
          required
          maxLength={60}
          defaultValue={defaults.name}
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field label="Age range" error={fieldError(state, "ageRange")}>
        <select
          name="ageRange"
          required
          defaultValue={defaults.ageRange ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Select…
          </option>
          {AGE_RANGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Photo"
        hint={
          photoStorageConfigured
            ? "Optional. Shown small, next to your name."
            : "Photo storage isn't configured yet, so uploads are skipped for now."
        }
        error={fieldError(state, "photo")}
      >
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={!photoStorageConfigured}
          className="w-full text-sm text-ink/70 file:mr-3 file:rounded-md file:border-0 file:bg-turf file:px-3 file:py-2 file:text-sm file:font-semibold file:text-chalk disabled:opacity-50"
        />
      </Field>

      <Field
        label="Zip code"
        hint="Used to find people near you. Never shown to anyone."
        error={fieldError(state, "zipCode")}
      >
        <input
          name="zipCode"
          type="text"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          required
          defaultValue={defaults.zipCode}
          autoComplete="postal-code"
          className={inputClass}
        />
      </Field>

      <Field label="How far will you travel?" error={fieldError(state, "travelRadiusMiles")}>
        <input type="hidden" name="travelRadiusMiles" value={radius} />
        <div className="rounded-md border border-turf/20 bg-white px-3 py-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="stat text-2xl font-semibold text-turf">{radius}</span>
            <span className="stat text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">
              miles
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={TRAVEL_RADIUS_OPTIONS.length - 1}
            step={1}
            value={radiusIndex}
            onChange={(e) => setRadiusIndex(Number(e.target.value))}
            aria-label="Travel radius in miles"
            className="w-full accent-[#ff6b35]"
          />
          <div className="mt-1 flex justify-between">
            {TRAVEL_RADIUS_OPTIONS.map((value) => (
              <span key={value} className="stat text-[10px] text-ink/40">
                {value}
              </span>
            ))}
          </div>
        </div>
      </Field>

      <Field label="Preferred contact" error={fieldError(state, "preferredContact")}>
        <select
          name="preferredContact"
          required
          defaultValue={defaults.preferredContact ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Select…
          </option>
          {PREFERRED_CONTACT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
    </>
  );
}
