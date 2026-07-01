import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Saved Notes" };

const notes = [
  {
    id: "n1",
    content:
      "Attention scores are just scaled dot products of queries and keys — when they point the same way, the score is high. Softmax then normalizes them into weights.",
    video: "Transformers, explained",
    videoId: "v_transformers",
    timestamp: "1:49",
    tags: ["Attention", "Math"],
    updated: "2 hours ago",
  },
  {
    id: "n2",
    content:
      "Design tokens should be the single source of truth. Never hardcode a hex value in a component — reference the token so dark mode and rebrands are free.",
    video: "Building a design system from scratch",
    videoId: "v_designsystems",
    timestamp: "14:20",
    tags: ["Tokens", "Best practice"],
    updated: "Yesterday",
  },
  {
    id: "n3",
    content:
      "B-tree indexes keep lookups at O(log n) but every write has to maintain the tree. For write-heavy tables, weigh the read speedup against the insert cost.",
    video: "Database indexing deep dive",
    videoId: "v_postgres",
    timestamp: "22:05",
    tags: ["PostgreSQL", "Trade-offs"],
    updated: "2 days ago",
  },
  {
    id: "n4",
    content:
      "RSCs render on the server and stream HTML — no JS shipped for them. Use client components only where you need interactivity or browser APIs.",
    video: "React Server Components, end to end",
    videoId: "v_rsc",
    timestamp: "08:12",
    tags: ["Next.js", "RSC"],
    updated: "3 days ago",
  },
];

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Saved Notes"
        description={`${notes.length} notes across your library`}
        action={
          <Button>
            <Plus className="size-4" />
            New note
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex flex-col rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20"
          >
            <p className="text-sm leading-relaxed text-foreground/90">
              {note.content}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {note.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
              <Link
                href={`/workspace/${note.videoId}`}
                className="inline-flex items-center gap-1.5 font-medium hover:text-foreground"
              >
                <Clock className="size-3" />
                {note.video} · {note.timestamp}
              </Link>
              <span>{note.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
