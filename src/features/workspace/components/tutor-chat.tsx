"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Clock, ScrollText, Sparkles } from "lucide-react";
import { AiRequestError } from "@/features/ai/types";
import { useChatHistory, useSendChatMessage } from "@/features/chat/use-chat";
import { usePlayer } from "@/features/workspace/player-context";
import type { ChatMessage } from "@/features/chat/types";
import { cn, formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const suggested = [
  "What is this video about?",
  "Summarize the main argument",
  "What are the key terms?",
];

export function TutorChat({
  videoId,
  transcriptReady,
}: {
  videoId: string;
  transcriptReady: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const chat = useSendChatMessage(videoId);
  const history = useChatHistory(videoId);
  const player = usePlayer();

  // Seed the thread with the saved conversation, unless the user already
  // started typing before it arrived.
  useEffect(() => {
    if (history.data && history.data.length > 0) {
      setMessages((m) => (m.length === 0 ? history.data : m));
    }
  }, [history.data]);

  const scrollToEnd = () =>
    requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ behavior: "smooth" }),
    );

  function send(text: string) {
    const content = text.trim();
    if (!content || chat.isPending) return;

    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", content },
    ]);
    setInput("");
    scrollToEnd();

    chat.mutate(content, {
      onSuccess: (res) => {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: res.answer,
            citations: res.citations,
          },
        ]);
        scrollToEnd();
      },
      onError: (err) => {
        const message =
          err instanceof AiRequestError
            ? err.message
            : "Something went wrong answering that. Please try again.";
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: message,
            isError: true,
          },
        ]);
        scrollToEnd();
      },
    });
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h3 className="text-sm font-medium leading-tight">AI Tutor</h3>
          <p className="text-xs text-muted-foreground">Grounded in this video</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="px-1 pt-2 text-sm text-muted-foreground">
            Ask anything about this video. Answers come straight from the
            transcript, with the moments they reference.
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col gap-1.5",
              msg.role === "user" ? "items-end" : "items-start",
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "rounded-tr-sm bg-primary text-primary-foreground"
                  : msg.isError
                    ? "rounded-tl-sm border border-destructive/30 bg-destructive/5 text-foreground"
                    : "rounded-tl-sm border bg-card text-foreground",
              )}
            >
              {msg.content}
            </div>
            {msg.citations && msg.citations.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {msg.citations.map((c, i) => (
                  <button
                    key={i}
                    title={c.text}
                    onClick={() => player.seekTo(c.startSec)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <Clock className="size-3" />
                    {formatTimestamp(c.startSec)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <AnimatePresence>
          {chat.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex w-fit items-center gap-1.5 rounded-lg rounded-tl-sm border bg-card px-3.5 py-3"
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-pulse rounded-full bg-muted-foreground/50"
                  style={{ animationDelay: `${d * 0.2}s` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {transcriptReady && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {suggested.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      {transcriptReady ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t p-3"
        >
          <div className="flex items-end gap-2 rounded-lg border bg-background p-1.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              aria-label="Ask a question about this video"
              placeholder="Ask anything about this video…"
              className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              className="size-8 shrink-0"
              disabled={!input.trim() || chat.isPending}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-2 border-t p-3 text-xs text-muted-foreground">
          <ScrollText className="size-3.5 shrink-0" />
          Chat becomes available once this video has a transcript.
        </div>
      )}
    </div>
  );
}
