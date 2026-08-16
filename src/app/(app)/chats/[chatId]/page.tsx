import Link from "next/link";
import { notFound } from "next/navigation";

import { ChatThread } from "@/components/chat-thread";
import { FlagIcon } from "@/components/icons";
import { ProfilePhoto } from "@/components/profile-card";
import { prisma } from "@/lib/db";
import { markChatRead } from "@/lib/notifications";
import { requireProfile } from "@/lib/session";
import { isBlockedBetween } from "@/lib/visibility";

/** 2-3 tappable openers, sport-aware. Client-side only — no DB table. */
function starterPrompts(sports: string[]): string[] {
  if (sports.includes("bjj")) {
    return ["When's your next roll?", "What gym are you at?", "Gi or no-gi?"];
  }
  if (sports.includes("running")) {
    return ["What's your usual route?", "What pace do you run?", "Morning or evening?"];
  }
  if (sports.includes("tennis")) {
    return ["Where do you usually play?", "Singles or doubles?", "Free this weekend?"];
  }
  return ["What days do you train?", "Where do you lift?", "What are you working on?"];
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const { profile } = await requireProfile();

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: {
      id: true,
      match: {
        select: {
          profileAId: true,
          profileBId: true,
          profileA: { select: { id: true, name: true, photoUrl: true, hidden: true } },
          profileB: { select: { id: true, name: true, photoUrl: true, hidden: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 200,
        select: { id: true, content: true, createdAt: true, senderProfileId: true },
      },
    },
  });
  if (!chat) notFound();

  const { profileAId, profileBId } = chat.match;
  if (profile.id !== profileAId && profile.id !== profileBId) notFound();

  const partner = profile.id === profileAId ? chat.match.profileB : chat.match.profileA;

  // Blocking retroactively hides the chat for both sides.
  if (partner.hidden || (await isBlockedBetween(profile.id, partner.id))) notFound();

  // Every sport the two have matched in — drives the starter prompts.
  const [a, b] = profile.id < partner.id ? [profile.id, partner.id] : [partner.id, profile.id];
  const matches = await prisma.match.findMany({
    where: { profileAId: a, profileBId: b },
    select: { sport: true },
  });

  // Clears this chat's half of the Notifications nav badge.
  await markChatRead(chat.id, profile.id);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-white px-5 py-3">
        <Link
          href="/notifications"
          aria-label="Back"
          className="stat shrink-0 text-lg text-ink/60 hover:text-ink"
        >
          ←
        </Link>

        <Link
          href={`/partners/${partner.id}`}
          className="flex min-w-0 flex-1 items-center gap-2.5"
        >
          <ProfilePhoto photoUrl={partner.photoUrl} name={partner.name} size="sm" />
          <span className="min-w-0">
            <span className="display block truncate text-xl text-ink">
              {partner.name}
            </span>
            <span className="stat block text-[10px] uppercase tracking-[0.12em] text-brand">
              Training Partner
            </span>
          </span>
        </Link>

        {/* Report reachable from chat, per the safety rule. */}
        <Link
          href={`/report/${partner.id}`}
          aria-label={`Report or block ${partner.name}`}
          title="Report or block"
          className="shrink-0 rounded p-1.5 text-ink/45 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <FlagIcon className="h-4 w-4" />
        </Link>
      </header>

      <ChatThread
        chatId={chat.id}
        partnerName={partner.name}
        starterPrompts={starterPrompts(matches.map((m) => m.sport))}
        initialMessages={chat.messages.map((m) => ({
          id: m.id,
          content: m.content,
          createdAt: m.createdAt.toISOString(),
          fromViewer: m.senderProfileId === profile.id,
        }))}
      />
    </>
  );
}
