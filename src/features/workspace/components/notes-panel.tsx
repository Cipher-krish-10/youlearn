"use client";

import { StickyNote } from "lucide-react";
import { useArtifact, useGenerateArtifact } from "@/features/ai/use-ai";
import { ArtifactState } from "@/features/workspace/components/artifact-state";

export function NotesPanel({
  videoId,
  transcriptReady,
}: {
  videoId: string;
  transcriptReady: boolean;
}) {
  const notes = useArtifact(videoId, "notes", transcriptReady);
  const gen = useGenerateArtifact(videoId, "notes");

  return (
    <ArtifactState
      label="notes"
      icon={StickyNote}
      transcriptReady={transcriptReady}
      isGenerated={!!notes.data}
      isBusy={notes.isLoading || gen.isPending}
      error={gen.error}
      onGenerate={() => gen.mutate(undefined)}
    >
      <div className="space-y-7">
        {notes.data?.data.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="font-medium">{section.heading}</h3>
            <ul className="mt-2.5 space-y-2">
              {section.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-2.5 text-sm leading-relaxed text-foreground/90"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  {point}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ArtifactState>
  );
}
