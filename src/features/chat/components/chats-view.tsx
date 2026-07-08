"use client";

import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { useConversations } from "@/features/chat/use-chats";
import { cn, focusRing, timeAgo, truncate } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatsView() {
  const { data, isLoading } = useConversations();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="AI Chats"
        description="Your conversations with the tutor, grouped by video"
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-lg" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No conversations yet"
          description="Open a video and ask the tutor a question — your chats will show up here."
        />
      ) : (
        <div className="space-y-3">
          {data.map((c) => (
            <Link
              key={c.videoId}
              href={`/workspace/${c.videoId}`}
              className={cn(
                "group flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20",
                focusRing,
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                <MessagesSquare className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">
                    {c.videoTitle}
                  </h3>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(c.lastAt)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {c.lastRole === "user" ? "You: " : ""}
                  {truncate(c.lastMessage, 160)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                  {c.messageCount} {c.messageCount === 1 ? "message" : "messages"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
