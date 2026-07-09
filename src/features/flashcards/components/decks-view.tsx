"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { useDecks } from "@/features/flashcards/use-decks";
import { cn, focusRing, timeAgo } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function DecksView() {
  const { data, isLoading } = useDecks();

  const totalCards = data?.reduce((sum, d) => sum + d.cardCount, 0) ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title="Flashcards"
        description={
          data && data.length > 0
            ? `${totalCards} cards across ${data.length} ${data.length === 1 ? "deck" : "decks"}`
            : "Decks generated from the videos you're studying"
        }
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[132px] rounded-lg" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No decks yet"
          description="Open a video's Flashcards tab and generate a deck — it will show up here."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((deck) => (
            <Link
              key={deck.videoId}
              href={`/workspace/${deck.videoId}?tab=flashcards`}
              className={cn(
                "group flex flex-col rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20",
                focusRing,
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                  <Layers className="size-[18px]" />
                </span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(deck.generatedAt)}
                </span>
              </div>
              <h3 className="mt-4 line-clamp-2 text-sm font-medium leading-snug">
                {deck.videoTitle}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
