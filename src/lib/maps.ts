/**
 * Google Places Autocomplete for event location entry. Needs a Maps
 * JavaScript API key with the Places library enabled — until one is set,
 * the event form falls back to a plain address + zip text field.
 */
export function googleMapsApiKey(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null;
}

export function googleMapsConfigured(): boolean {
  return Boolean(googleMapsApiKey());
}
