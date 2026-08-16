import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { requireProfile } from "@/lib/session";
import { isBlockedBetween } from "@/lib/visibility";

/**
 * Poll endpoint for the chat thread. Deliberately simple — swap for Supabase
 * Realtime if message volume ever demands it.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const { chatId } = await params;
  const { profile } = await requireProfile();

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { id: true, match: { select: { profileAId: true, profileBId: true } } },
  });
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { profileAId, profileBId } = chat.match;
  if (profile.id !== profileAId && profile.id !== profileBId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const otherId = profile.id === profileAId ? profileBId : profileAId;
  if (await isBlockedBetween(profile.id, otherId)) {
    return NextResponse.json({ error: "Unavailable" }, { status: 403 });
  }

  const after = new URL(request.url).searchParams.get("after");
  const afterDate = after ? new Date(after) : null;

  const messages = await prisma.message.findMany({
    where: {
      chatId: chat.id,
      ...(afterDate && !Number.isNaN(afterDate.getTime())
        ? { createdAt: { gt: afterDate } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
    take: 200,
    select: {
      id: true,
      content: true,
      createdAt: true,
      senderProfileId: true,
    },
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      fromViewer: m.senderProfileId === profile.id,
    })),
  });
}
