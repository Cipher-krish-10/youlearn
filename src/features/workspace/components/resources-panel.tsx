import { BookMarked, ExternalLink } from "lucide-react";
import { NotGenerated } from "@/features/workspace/components/not-generated";

const sampleResources = [
  { title: "Attention Is All You Need", source: "arXiv · paper" },
  { title: "The Illustrated Transformer", source: "jalammar.github.io" },
  { title: "nanoGPT", source: "github.com/karpathy" },
];

export function ResourcesPanel({ isSample }: { isSample: boolean }) {
  if (!isSample) return <NotGenerated icon={BookMarked} label="resources" />;

  return (
    <div className="space-y-3">
      {sampleResources.map((r) => (
        <a
          key={r.title}
          href="#"
          className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
            <BookMarked className="size-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium">{r.title}</h3>
            <p className="truncate text-xs text-muted-foreground">{r.source}</p>
          </div>
          <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}
