"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { useArtifact, useGenerateArtifact } from "@/features/ai/use-ai";
import { cn, focusRing } from "@/lib/utils";
import { ArtifactState } from "@/features/workspace/components/artifact-state";

export function FlashcardsPanel({
  videoId,
  transcriptReady,
}: {
  videoId: string;
  transcriptReady: boolean;
}) {
  const flashcards = useArtifact(videoId, "flashcards", transcriptReady);
  const gen = useGenerateArtifact(videoId, "flashcards");

  return (
    <ArtifactState
      label="flashcards"
      icon={Layers}
      transcriptReady={transcriptReady}
      isGenerated={!!flashcards.data}
      isBusy={flashcards.isLoading || gen.isPending}
      error={gen.error}
      onGenerate={() => gen.mutate(undefined)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {flashcards.data?.data.cards.map((card, i) => (
          <Flashcard key={i} front={card.front} back={card.back} />
        ))}
      </div>
    </ArtifactState>
  );
}

function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className={cn(
        "flex min-h-[132px] flex-col rounded-lg border bg-card p-4 text-left transition-colors hover:border-foreground/20",
        focusRing,
      )}
      aria-label={flipped ? "Show question" : "Show answer"}
    >
      <span className="text-xs text-muted-foreground">
        {flipped ? "Answer" : "Question"}
      </span>
      <span
        className={cn(
          "mt-2 flex-1 text-sm leading-relaxed",
          flipped ? "text-foreground/90" : "font-medium",
        )}
      >
        {flipped ? back : front}
      </span>
      <span className="mt-3 text-xs text-muted-foreground">
        Tap to {flipped ? "flip back" : "reveal"}
      </span>
    </button>
  );
}
