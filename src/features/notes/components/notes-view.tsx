"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Loader2, Plus, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateNote, useDeleteNote, useNotes } from "@/features/notes/use-notes";
import { formatTimestamp, timeAgo } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function NotesView() {
  const { data: notes, isLoading } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();

  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  function add() {
    const trimmed = content.trim();
    if (!trimmed) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);

    createNote.mutate(
      { content: trimmed, tags },
      {
        onSuccess: () => {
          setContent("");
          setTagsInput("");
        },
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Saved Notes"
        description={
          notes ? `${notes.length} ${notes.length === 1 ? "note" : "notes"}` : ""
        }
      />

      {/* Composer */}
      <div className="rounded-lg border bg-card p-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Jot down a thought, insight, or reminder…"
          rows={3}
          className="border-0 px-1 shadow-none focus-visible:ring-0"
        />
        <div className="mt-2 flex items-center gap-2">
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tags, comma, separated"
            className="h-8 flex-1 text-xs"
            aria-label="Tags"
          />
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

      {/* List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : !notes || notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Capture your first thought above — it'll be saved to your account."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group flex flex-col rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20"
            >
              {note.timestampSec != null && note.videoId && (
                <Link
                  href={`/workspace/${note.videoId}?tab=notes&t=${Math.floor(note.timestampSec)}`}
                  className="mb-2 inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  title="Open the video at this moment"
                >
                  <Clock className="size-3" />
                  {formatTimestamp(note.timestampSec)}
                </Link>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {note.content}
              </p>
              {note.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {note.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span>{timeAgo(note.createdAt)}</span>
                <button
                  onClick={() => deleteNote.mutate(note.id)}
                  aria-label="Delete note"
                  className="opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
