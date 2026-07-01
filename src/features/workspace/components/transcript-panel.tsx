"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Search } from "lucide-react";
import type { TranscriptLineDTO } from "@/features/ingestion/types";
import { formatTimestamp, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface TranscriptPanelProps {
  lines: TranscriptLineDTO[];
  isLoading?: boolean;
  errorMessage?: string | null;
  activeSec?: number;
  onSeek?: (sec: number) => void;
}

export function TranscriptPanel({
  lines,
  isLoading,
  errorMessage,
  activeSec,
  onSeek,
}: TranscriptPanelProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return lines;
    const q = query.toLowerCase();
    return lines.filter((l) => l.text.toLowerCase().includes(q));
  }, [query, lines]);

  if (isLoading) return <TranscriptSkeleton />;

  if (errorMessage) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <span className="flex size-10 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
          <AlertCircle className="size-5" />
        </span>
        <h3 className="mt-4 text-sm font-medium">Transcript unavailable</h3>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
          {errorMessage}
        </p>
      </div>
    );
  }

  function highlight(text: string) {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "ig"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="rounded bg-primary/15 text-foreground">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the transcript"
          placeholder="Search the transcript…"
          className="pl-9"
        />
      </div>

      <div className="-mr-2 flex-1 space-y-0.5 overflow-y-auto pr-2">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No matches for “{query}”.
          </p>
        )}
        {filtered.map((line) => {
          const active = activeSec != null && line.startSec === activeSec;
          return (
            <button
              key={line.startSec}
              onClick={() => onSeek?.(line.startSec)}
              className={cn(
                "flex w-full gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent",
                active && "bg-accent",
              )}
            >
              <span
                className={cn(
                  "shrink-0 font-mono text-xs tabular-nums",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {formatTimestamp(line.startSec)}
              </span>
              <span className="text-sm leading-relaxed text-foreground/80">
                {highlight(line.text)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TranscriptSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-full" />
      <div className="space-y-2.5 pt-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-4 w-10 shrink-0" />
            <Skeleton className="h-4 flex-1" style={{ maxWidth: `${70 + ((i * 7) % 25)}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
