import { NextResponse } from "next/server";

import { hasUnreadNotifications } from "@/lib/notifications";
import { requireProfile } from "@/lib/session";

/** Poll endpoint backing the bottom nav's live unread dot. */
export async function GET() {
  const { profile } = await requireProfile();
  const hasUnread = await hasUnreadNotifications(profile.id);
  return NextResponse.json({ hasUnread });
}
