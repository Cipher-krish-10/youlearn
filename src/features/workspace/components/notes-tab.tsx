"use client";

import { useState } from "react";
import { PenLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoNotes } from "@/features/notes/components/video-notes";
import { NotesPanel } from "@/features/workspace/components/notes-panel";

const modes = [
  { id: "own", label: "My notes", icon: PenLine },
  { id: "ai", label: "AI notes", icon: Sparkles },
] as const;

type Mode = (typeof modes)[number]["id"];

/** The Notes tab: write your own notes, or generate them with AI. */
export function NotesTab({
  videoId,
  transcriptReady,
}: {
  videoId: string;
  transcriptReady: boolean;
}) {
  const [mode, setMode] = useState<Mode>("own");

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Note source"
        className="inline-flex items-center gap-1 rounded-lg border bg-muted/40 p-1"
      >
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              mode === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {mode === "own" ? (
        <VideoNotes videoId={videoId} />
      ) : (
        <NotesPanel videoId={videoId} transcriptReady={transcriptReady} />
      )}
    </div>
  );
}
