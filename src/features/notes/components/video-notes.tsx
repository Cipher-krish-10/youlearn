"use client";

import { useState } from "react";
import { Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateNote,
  useDeleteNote,
  useNotes,
} from "@/features/notes/use-notes";
import { usePlayer } from "@/features/workspace/player-context";
import { cn, formatTimestamp, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/** Personal notes for one video, anchored to the player's current time. */
export function VideoNotes({ videoId }: { videoId: string }) {
  const player = usePlayer();
  const { data: allNotes } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const [content, setContent] = useState("");
  const [anchor, setAnchor] = useState(true);

  const notes = (allNotes ?? []).filter((n) => n.videoId === videoId);

  function add() {
    const trimmed = content.trim();
    if (!trimmed || createNote.isPending) return;

    const currentTime = anchor ? player.getCurrentTime() : null;
    createNote.mutate(
      {
        content: trimmed,
        tags: [],
        videoId,
        timestampSec:
          currentTime != null ? Math.round(currentTime * 10) / 10 : null,
      },
      {
        onSuccess: () => setContent(""),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Take a note on this video…"
          rows={2}
          className="border-0 px-1 shadow-none focus-visible:ring-0"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setAnchor((v) => !v)}
            aria-pressed={anchor}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
              anchor
                ? "border-primary/40 bg-primary/10 text-primary"
                : "text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            <Clock className="size-3" />
            Anchor to current time
          </button>
          <Button
            size="sm"
            onClick={add}
            disabled={!content.trim() || createNote.isPending}
          >
            {createNote.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Add note
          </Button>
        </div>
      </div>

      {notes.length > 0 && (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="group flex items-start gap-3 rounded-lg border bg-card px-3.5 py-3"
            >
              {note.timestampSec != null && (
                <button
                  onClick={() => player.seekTo(note.timestampSec!)}
                  title="Jump to this moment"
                  className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <Clock className="size-3" />
                  {formatTimestamp(note.timestampSec)}
                </button>
              )}
              <p className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {note.content}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {timeAgo(note.createdAt)}
                </span>
                <button
                  onClick={() => deleteNote.mutate(note.id)}
                  aria-label="Delete note"
                  className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
