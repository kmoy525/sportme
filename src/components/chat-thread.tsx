"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { sendMessageAction } from "@/lib/actions/chat-actions";
import { emptyFormState } from "@/lib/form";

import { FormError, inputClass } from "./ui";

export type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  fromViewer: boolean;
};

const POLL_MS = 4000;

export function ChatThread({
  chatId,
  initialMessages,
  starterPrompts,
  partnerName,
}: {
  chatId: string;
  initialMessages: ChatMessage[];
  starterPrompts: string[];
  partnerName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastAt = messages.at(-1)?.createdAt;

  const merge = useCallback((incoming: ChatMessage[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !seen.has(m.id));
      return fresh.length === 0 ? prev : [...prev, ...fresh];
    });
  }, []);

  // Poll for the other side's messages.
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const url = new URL(`/api/chats/${chatId}/messages`, window.location.origin);
        if (lastAt) url.searchParams.set("after", lastAt);

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok || cancelled) return;

        const body = (await res.json()) as { messages: ChatMessage[] };
        if (!cancelled) merge(body.messages);
      } catch {
        // Transient network failure — the next tick retries.
      }
    }

    const timer = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [chatId, lastAt, merge]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed || pending) return;

    setError(undefined);
    setDraft("");

    startTransition(async () => {
      const form = new FormData();
      form.set("chatId", chatId);
      form.set("content", trimmed);

      const result = await sendMessageAction(emptyFormState, form);
      if (result.error) {
        setError(result.error);
        setDraft(trimmed);
        return;
      }

      // Pull our own message back so ids and timestamps come from the server.
      const url = new URL(`/api/chats/${chatId}/messages`, window.location.origin);
      if (lastAt) url.searchParams.set("after", lastAt);
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const body = (await res.json()) as { messages: ChatMessage[] };
        merge(body.messages);
      }
    });
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1 space-y-2.5 px-5 py-4 pb-40">
        {messages.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-ink/55">
              You and {partnerName} are training partners. Break the ice:
            </p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={message.fromViewer ? "flex justify-end" : "flex justify-start"}
          >
            <p
              className={
                message.fromViewer
                  ? "max-w-[80%] rounded-xl rounded-br-sm border border-ink/10 bg-white px-3 py-2 text-[15px] text-ink"
                  : "max-w-[80%] rounded-xl rounded-bl-sm border border-ink/10 bg-white px-3 py-2 text-[15px] text-ink"
              }
            >
              {message.content}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 border-t border-ink/10 bg-white">
        <div className="mx-auto max-w-md px-5 py-3">
          {/* Starter prompts on first open — client-side only, no DB table. */}
          {messages.length === 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setDraft(prompt);
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-ink/25 bg-white px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink/50 hover:bg-ink/5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <FormError>{error}</FormError>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="mt-1 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${partnerName}…`}
              aria-label="Message"
              maxLength={2000}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={pending || draft.trim().length === 0}
              className="h-11 shrink-0 rounded-full bg-brand px-5 text-[15px] font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
