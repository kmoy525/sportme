import "server-only";

const EARTH_RADIUS_MILES = 3958.8;

export type LatLng = { lat: number; lng: number };

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance in miles. Server-side only — never shown to the user. */
export function milesBetween(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Bounding box for a radius, used to prefilter candidates in SQL before the
 * exact haversine pass in JS.
 */
export function boundingBox(center: LatLng, radiusMiles: number) {
  const latDelta = radiusMiles / 69;
  const cosLat = Math.cos(toRadians(center.lat));
  // Guard against the poles collapsing the longitude span to zero.
  const lngDelta = radiusMiles / (69 * Math.max(0.01, Math.abs(cosLat)));

  return {
    minLat: center.lat - latDelta,
    maxLat: center.lat + latDelta,
    minLng: center.lng - lngDelta,
    maxLng: center.lng + lngDelta,
  };
}

// Travel radius options/validation live in travel-radius.ts (no "server-only"),
// since client components like the radius slider need them too.
export { TRAVEL_RADIUS_OPTIONS, isTravelRadius, type TravelRadius } from "./travel-radius";
