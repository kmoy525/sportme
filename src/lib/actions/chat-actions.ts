"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "../db";
import { str, type FormState } from "../form";
import { requireProfile } from "../session";
import { isBlockedBetween } from "../visibility";

const MAX_MESSAGE_LENGTH = 2000;

export async function sendMessageAction(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  const { profile } = await requireProfile();

  const chatId = str(form, "chatId");
  const content = str(form, "content");

  if (!content) return {};
  if (content.length > MAX_MESSAGE_LENGTH) {
    return { error: "That message is too long." };
  }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { id: true, match: { select: { profileAId: true, profileBId: true } } },
  });
  if (!chat) return { error: "That conversation no longer exists." };

  const { profileAId, profileBId } = chat.match;
  if (profile.id !== profileAId && profile.id !== profileBId) {
    return { error: "That conversation no longer exists." };
  }

  const otherId = profile.id === profileAId ? profileBId : profileAId;
  if (await isBlockedBetween(profile.id, otherId)) {
    return { error: "This conversation is no longer available." };
  }

  await prisma.message.create({
    data: { chatId: chat.id, senderProfileId: profile.id, content },
  });

  revalidatePath(`/chats/${chat.id}`);
  return {};
}

/**
 * Records the "Did you work out together?" response. Whoever answers first
 * settles it for both sides — the row's mere existence is what stops the
 * prompt from showing again (see isMeetupCheckDue).
 */
export async function respondMeetupCheckAction(chatId: string, workedOut: boolean) {
  const { profile } = await requireProfile();

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { id: true, match: { select: { profileAId: true, profileBId: true } } },
  });
  if (!chat) return;

  const { profileAId, profileBId } = chat.match;
  if (profile.id !== profileAId && profile.id !== profileBId) return;

  await prisma.meetupCheck.upsert({
    where: { chatId },
    update: {},
    create: { chatId, workedOut },
  });

  revalidatePath(`/chats/${chatId}`);
  revalidatePath("/notifications");
}
