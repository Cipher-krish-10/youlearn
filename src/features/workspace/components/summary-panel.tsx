"use client";

import { Check, FileText } from "lucide-react";
import { useArtifact, useGenerateArtifact } from "@/features/ai/use-ai";
import { Skeleton } from "@/components/ui/skeleton";
import { ArtifactState } from "@/features/workspace/components/artifact-state";

export function SummaryPanel({
  videoId,
  transcriptReady,
}: {
  videoId: string;
  transcriptReady: boolean;
}) {
  const summary = useArtifact(videoId, "summary", transcriptReady);
  const takeaways = useArtifact(videoId, "takeaways", transcriptReady);
  const concepts = useArtifact(videoId, "concepts", transcriptReady);

  const summaryGen = useGenerateArtifact(videoId, "summary");
  const takeawaysGen = useGenerateArtifact(videoId, "takeaways");
  const conceptsGen = useGenerateArtifact(videoId, "concepts");

  const isBusy =
    summary.isLoading ||
    takeaways.isLoading ||
    concepts.isLoading ||
    summaryGen.isPending ||
    takeawaysGen.isPending ||
    conceptsGen.isPending;

  const generateAll = (force: boolean) => {
    summaryGen.mutate({ force });
    takeawaysGen.mutate({ force });
    conceptsGen.mutate({ force });
  };

  return (
    <ArtifactState
      label="summary"
      icon={FileText}
      transcriptReady={transcriptReady}
      isGenerated={!!summary.data}
      isBusy={isBusy}
      error={summaryGen.error}
      onGenerate={(force) => generateAll(force)}
    >
      <div className="space-y-8">
        <Section title="Executive summary">
          <p className="leading-relaxed text-foreground/90">
            {summary.data?.data.executive}
          </p>
        </Section>

        <Section title="Key takeaways">
          {takeaways.data ? (
            <ul className="space-y-2.5">
              {takeaways.data.data.items.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm leading-relaxed text-foreground/90">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <PendingLines />
          )}
        </Section>

        <Section title="Important concepts">
          {concepts.data ? (
            <dl className="divide-y rounded-lg border">
              {concepts.data.data.items.map((c) => (
                <div key={c.term} className="grid gap-1 p-4 sm:grid-cols-[160px_1fr] sm:gap-4">
                  <dt className="text-sm font-medium">{c.term}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    {c.definition}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <PendingLines />
          )}
        </Section>

        <Section title="Detailed breakdown">
          <p className="leading-relaxed text-foreground/90">
            {summary.data?.data.detailed}
          </p>
        </Section>
      </div>
    </ArtifactState>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PendingLines() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[88%]" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
