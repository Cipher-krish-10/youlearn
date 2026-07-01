import type { Metadata } from "next";
import Link from "next/link";
import { Layers, GraduationCap } from "lucide-react";
import { cn, focusRing } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Flashcards" };

const decks = [
  {
    id: "d1",
    title: "Transformers, explained",
    videoId: "v_transformers",
    total: 24,
    mastered: 15,
    due: 6,
  },
  {
    id: "d2",
    title: "Database indexing deep dive",
    videoId: "v_postgres",
    total: 18,
    mastered: 4,
    due: 11,
  },
  {
    id: "d3",
    title: "Building a design system",
    videoId: "v_designsystems",
    total: 32,
    mastered: 32,
    due: 0,
  },
  {
    id: "d4",
    title: "React Server Components",
    videoId: "v_rsc",
    total: 21,
    mastered: 9,
    due: 5,
  },
];

export default function FlashcardsPage() {
  const totalDue = decks.reduce((sum, d) => sum + d.due, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Flashcards"
        description={`${totalDue} cards due for review across ${decks.length} decks`}
        action={
          <Button>
            <GraduationCap className="size-4" />
            Review all due
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => {
          const pct = Math.round((deck.mastered / deck.total) * 100);
          return (
            <Link
              key={deck.id}
              href={`/workspace/${deck.videoId}`}
              className={cn(
                "group flex flex-col rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20",
                focusRing,
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                  <Layers className="size-[18px]" />
                </span>
                {deck.due > 0 ? (
                  <span className="text-xs font-medium text-foreground tabular-nums">
                    {deck.due} due
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    All caught up
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-sm font-medium leading-snug">
                {deck.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {deck.mastered} of {deck.total} mastered
              </p>
              <div className="mt-auto pt-4">
                <Progress value={pct} className="h-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
