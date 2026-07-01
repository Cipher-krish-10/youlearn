import type { Metadata } from "next";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { cn, focusRing } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "AI Chats" };

const chats = [
  {
    id: "ch1",
    videoId: "v_transformers",
    title: "Difference between keys and values",
    video: "Transformers, explained",
    preview:
      "The key decides how much attention a token receives; the value is the information that flows through once selected.",
    messages: 8,
    time: "2h ago",
  },
  {
    id: "ch2",
    videoId: "v_postgres",
    title: "When should I avoid an index?",
    video: "Database indexing deep dive",
    preview:
      "On write-heavy tables with low read volume, the maintenance cost of the index can outweigh the lookup speedup.",
    messages: 12,
    time: "Yesterday",
  },
  {
    id: "ch3",
    videoId: "v_rsc",
    title: "Can server components use hooks?",
    video: "React Server Components, end to end",
    preview:
      "No — useState and useEffect only run in client components. Server components render once on the server.",
    messages: 5,
    time: "2 days ago",
  },
];

export default function ChatsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="AI Chats"
        description="Your conversations with the tutor, grouped by video"
      />

      <div className="space-y-3">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/workspace/${chat.videoId}`}
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
                <h3 className="truncate text-sm font-medium">{chat.title}</h3>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {chat.time}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {chat.preview}
              </p>
              <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                {chat.video} · {chat.messages} messages
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
