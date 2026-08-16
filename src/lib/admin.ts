import "server-only";
import { headers } from "next/headers";

/**
 * Bare-bones internal auth for the admin review queue: a single shared token
 * in the query string or an X-Admin-Token header, checked against ADMIN_TOKEN.
 * Good enough for MVP; swap for real admin roles before this page matters.
 */
export async function isAdminRequest(searchParams: URLSearchParams): Promise<boolean> {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;

  const fromQuery = searchParams.get("token");
  const fromHeader = (await headers()).get("x-admin-token");
  return fromQuery === expected || fromHeader === expected;
}
