"use client";

import Link from "next/link";
import { ArrowLeft, Film, X } from "lucide-react";
import { toast } from "sonner";
import {
  useCollection,
  useRemoveVideoFromCollection,
} from "@/features/collections/use-collections";
import { cn, focusRing } from "@/lib/utils";
import { VideoCard } from "@/components/shared/video-card";
import { VideoCardSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export function CollectionDetailView({ id }: { id: string }) {
  const { data, isLoading, isError } = useCollection(id);
  const remove = useRemoveVideoFromCollection();

  if (isError) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-sm text-muted-foreground">
          This collection doesn&apos;t exist or isn&apos;t yours.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/collections">
            <ArrowLeft className="size-4" />
            Back to collections
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link href="/collections">
            <ArrowLeft className="size-4" />
            Collections
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          {data?.collection.name ?? "Collection"}
        </h1>
        {data?.collection.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {data.collection.description}
          </p>
        )}
        {data && (
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {data.videos.length}{" "}
            {data.videos.length === 1 ? "video" : "videos"}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : !data || data.videos.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No videos here yet"
          description="Open any video and use “Add to collection” to add it here."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.videos.map((video) => (
            <div key={video.id} className="group/item relative">
              <VideoCard video={video} />
              <button
                onClick={() =>
                  remove.mutate(
                    { collectionId: id, videoId: video.id },
                    { onError: (e) => toast.error(e.message) },
                  )
                }
                aria-label="Remove from collection"
                className={cn(
                  "absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-md border bg-background/90 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover/item:opacity-100",
                  focusRing,
                )}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
