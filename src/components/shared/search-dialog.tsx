"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Search, StickyNote } from "lucide-react";
import { useVideos } from "@/features/ingestion/use-ingestion";
import { useNotes } from "@/features/notes/use-notes";
import { truncate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_PER_GROUP = 6;

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[20%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">Search</DialogTitle>
        {/* Mount on open so the queries only run when the dialog is used. */}
        {open && <SearchResults onNavigate={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function SearchResults({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const videos = useVideos();
  const notes = useNotes();

  const q = query.trim().toLowerCase();

  const videoHits = useMemo(() => {
    if (!q || !videos.data) return [];
    return videos.data
      .filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.channelTitle ?? "").toLowerCase().includes(q),
      )
      .slice(0, MAX_PER_GROUP);
  }, [q, videos.data]);

  const noteHits = useMemo(() => {
    if (!q || !notes.data) return [];
    return notes.data
      .filter(
        (n) =>
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, MAX_PER_GROUP);
  }, [q, notes.data]);

  function go(href: string) {
    onNavigate();
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const first = videoHits[0]
      ? `/workspace/${videoHits[0].id}`
      : noteHits[0]
        ? noteHits[0].videoId
          ? `/workspace/${noteHits[0].videoId}?tab=notes`
          : "/notes"
        : null;
    if (first) go(first);
  }

  const loading = videos.isLoading || notes.isLoading;
  const empty = q.length > 0 && !loading && videoHits.length === 0 && noteHits.length === 0;

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2.5 border-b px-4"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos and notes…"
          aria-label="Search videos and notes"
          className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>

      <div className="max-h-[50vh] overflow-y-auto p-2">
        {q.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            Type to search your videos and notes.
          </p>
        )}

        {empty && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No matches for &ldquo;{truncate(query, 40)}&rdquo;.
          </p>
        )}

        {videoHits.length > 0 && (
          <div>
            <p className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
              Videos
            </p>
            {videoHits.map((v) => (
              <button
                key={v.id}
                onClick={() => go(`/workspace/${v.id}`)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                <Play className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{v.title}</span>
                  {v.channelTitle && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {v.channelTitle}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}

        {noteHits.length > 0 && (
          <div>
            <p className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
              Notes
            </p>
            {noteHits.map((n) => (
              <button
                key={n.id}
                onClick={() =>
                  go(n.videoId ? `/workspace/${n.videoId}?tab=notes` : "/notes")
                }
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                <StickyNote className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">
                  {truncate(n.content, 80)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
