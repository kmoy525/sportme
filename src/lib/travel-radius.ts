/**
 * Client-safe: no "server-only" import, so client components (the travel
 * radius slider) can use these without pulling server-only code into their
 * bundle. Distance math itself stays in distance.ts.
 */
export const TRAVEL_RADIUS_OPTIONS = [5, 10, 25, 50, 100] as const;

export type TravelRadius = (typeof TRAVEL_RADIUS_OPTIONS)[number];

export function isTravelRadius(value: number): value is TravelRadius {
  return (TRAVEL_RADIUS_OPTIONS as readonly number[]).includes(value);
}
