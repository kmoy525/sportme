"use client";

import { useEffect, useRef, useState } from "react";

import { Field, inputClass } from "@/components/ui";
import type { FormState } from "@/lib/form";
import { fieldError } from "@/lib/form";

export type ResolvedLocation = {
  locationText: string;
  zipCode: string;
  lat: number;
  lng: number;
};

function extractZip(components: google.maps.GeocoderAddressComponent[] | undefined): string {
  return components?.find((c) => c.types.includes("postal_code"))?.short_name ?? "";
}

let mapsScriptPromise: Promise<void> | null = null;

/** Loads the Maps JS API (with the Places library) exactly once per page. */
function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (mapsScriptPromise) return mapsScriptPromise;

  mapsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return mapsScriptPromise;
}

/**
 * Google Places Autocomplete for event location entry, resolving to a full
 * address plus lat/lng. Falls back to a plain address + zip text field when
 * no API key is configured yet.
 */
export function LocationAutocomplete({
  state,
  apiKey,
  defaultLocationText,
  defaultZipCode,
}: {
  state: FormState;
  apiKey: string | null;
  defaultLocationText?: string;
  defaultZipCode?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resolved, setResolved] = useState<ResolvedLocation | null>(null);
  const [mapsFailed, setMapsFailed] = useState(false);
  const [rawText, setRawText] = useState(defaultLocationText ?? "");

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    let autocomplete: google.maps.places.Autocomplete | null = null;
    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current) return;
        // Guard the whole setup: if Google ever removes/renames this widget,
        // fail over to the plain text fields instead of a broken input.
        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["formatted_address", "geometry", "address_components"],
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "us" },
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();
          const loc = place?.geometry?.location;
          if (!place?.formatted_address || !loc) return;

          setResolved({
            locationText: place.formatted_address,
            zipCode: extractZip(place.address_components),
            lat: loc.lat(),
            lng: loc.lng(),
          });
          setRawText(place.formatted_address);
        });
      })
      .catch(() => setMapsFailed(true));

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  if (!apiKey || mapsFailed) {
    return (
      <>
        <Field label="Location" error={fieldError(state, "locationText")}>
          <input
            name="locationText"
            type="text"
            required
            maxLength={120}
            defaultValue={defaultLocationText}
            placeholder="Gracie Barra, 4th & Main"
            className={inputClass}
          />
        </Field>
        <Field label="Zip code" error={fieldError(state, "zipCode")}>
          <input
            name="zipCode"
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            required
            defaultValue={defaultZipCode}
            className={inputClass}
          />
        </Field>
      </>
    );
  }

  return (
    <Field
      label="Location"
      hint="Start typing an address or place name."
      error={fieldError(state, "locationText") ?? fieldError(state, "zipCode")}
    >
      <input
        ref={inputRef}
        type="text"
        required
        value={rawText}
        onChange={(e) => {
          setRawText(e.target.value);
          setResolved(null);
        }}
        placeholder="Search for a place or address…"
        className={inputClass}
      />
      <input type="hidden" name="locationText" value={resolved?.locationText ?? rawText} />
      <input type="hidden" name="zipCode" value={resolved?.zipCode ?? defaultZipCode ?? ""} />
      <input type="hidden" name="lat" value={resolved?.lat ?? ""} />
      <input type="hidden" name="lng" value={resolved?.lng ?? ""} />
    </Field>
  );
}
