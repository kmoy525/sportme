import "server-only";

import { prisma } from "./db";

const MIN_MESSAGES = 5;
const MIN_DAYS_ELAPSED = 3;
const MIN_ELAPSED_MS = MIN_DAYS_ELAPSED * 24 * 60 * 60 * 1000;

/**
 * "Did you work out together?" is due once a chat has at least 5 messages
 * total and its last message is at least 3 days old — and it hasn't already
 * been answered (a MeetupCheck row exists once it has).
 */
export async function isMeetupCheckDue(chatId: string): Promise<boolean> {
  const existing = await prisma.meetupCheck.findUnique({
    where: { chatId },
    select: { id: true },
  });
  if (existing) return false;

  const [messageCount, lastMessage] = await Promise.all([
    prisma.message.count({ where: { chatId } }),
    prisma.message.findFirst({
      where: { chatId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);
  if (messageCount < MIN_MESSAGES || !lastMessage) return false;

  return Date.now() - lastMessage.createdAt.getTime() >= MIN_ELAPSED_MS;
}

/** Batch version for chat list rendering — one query per collection instead of N. */
export async function dueMeetupCheckChatIds(chatIds: string[]): Promise<Set<string>> {
  if (chatIds.length === 0) return new Set();

  const [answered, counts, lastMessages] = await Promise.all([
    prisma.meetupCheck.findMany({
      where: { chatId: { in: chatIds } },
      select: { chatId: true },
    }),
    prisma.message.groupBy({
      by: ["chatId"],
      where: { chatId: { in: chatIds } },
      _count: { _all: true },
    }),
    prisma.message.findMany({
      where: { chatId: { in: chatIds } },
      orderBy: { createdAt: "desc" },
      distinct: ["chatId"],
      select: { chatId: true, createdAt: true },
    }),
  ]);

  const answeredIds = new Set(answered.map((a) => a.chatId));
  const countByChatId = new Map(counts.map((c) => [c.chatId, c._count._all]));
  const lastMessageByChatId = new Map(lastMessages.map((m) => [m.chatId, m.createdAt]));

  const due = new Set<string>();
  for (const chatId of chatIds) {
    if (answeredIds.has(chatId)) continue;
    const count = countByChatId.get(chatId) ?? 0;
    const lastMessage = lastMessageByChatId.get(chatId);
    if (count < MIN_MESSAGES || !lastMessage) continue;
    if (Date.now() - lastMessage.getTime() >= MIN_ELAPSED_MS) due.add(chatId);
  }
  return due;
}
