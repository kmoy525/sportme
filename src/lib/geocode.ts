import "server-only";

export type GeoPoint = { lat: number; lng: number };

const ZIP_RE = /^\d{5}$/;

export function isValidZip(zip: string): boolean {
  return ZIP_RE.test(zip.trim());
}

/**
 * Zip -> lat/lng. Server-side only; the result is persisted on the profile and
 * never returned to the client.
 *
 * Uses the Google Geocoding API when GOOGLE_GEOCODING_API_KEY is set, and falls
 * back to Zippopotam.us (free, no key, US zips) otherwise.
 */
export async function geocodeZip(zip: string): Promise<GeoPoint | null> {
  const trimmed = zip.trim();
  if (!isValidZip(trimmed)) return null;

  const googleKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (googleKey) {
    const viaGoogle = await geocodeWithGoogle(trimmed, googleKey);
    if (viaGoogle) return viaGoogle;
  }
  return geocodeWithZippopotam(trimmed);
}

async function geocodeWithGoogle(zip: string, key: string): Promise<GeoPoint | null> {
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("components", `postal_code:${zip}|country:US`);
    url.searchParams.set("key", key);

    const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });
    if (!res.ok) return null;

    const body = (await res.json()) as {
      status?: string;
      results?: { geometry?: { location?: { lat?: number; lng?: number } } }[];
    };
    const loc = body.results?.[0]?.geometry?.location;
    if (body.status !== "OK" || typeof loc?.lat !== "number" || typeof loc?.lng !== "number") {
      return null;
    }
    return { lat: loc.lat, lng: loc.lng };
  } catch {
    return null;
  }
}

async function geocodeWithZippopotam(zip: string): Promise<GeoPoint | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      // Zip centroids never move; cache hard.
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) return null;

    const body = (await res.json()) as {
      places?: { latitude?: string; longitude?: string }[];
    };
    const place = body.places?.[0];
    if (!place?.latitude || !place?.longitude) return null;

    const lat = Number.parseFloat(place.latitude);
    const lng = Number.parseFloat(place.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  }
}
