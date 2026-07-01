import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import type { VideoDTO } from "@/features/ingestion/types";
import { cn } from "@/lib/utils";
import { VideoCard } from "@/components/shared/video-card";
import { VideoCardSkeleton } from "@/components/shared/skeletons";

const DEFAULT_GRID =
  "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

/**
 * Presentational grid for the real video library. Owns the loading / empty /
 * error states so callers just pass the query result and an empty state.
 */
export function VideoGrid({
  videos,
  isLoading,
  isError,
  skeletonCount = 8,
  className = DEFAULT_GRID,
  empty,
}: {
  videos: VideoDTO[] | undefined;
  isLoading: boolean;
  isError: boolean;
  skeletonCount?: number;
  className?: string;
  empty: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className={cn(className, "animate-fade-rise")}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
        <AlertCircle className="size-5 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          We couldn&apos;t load your library. Please refresh and try again.
        </p>
      </div>
    );
  }

  if (!videos || videos.length === 0) return <>{empty}</>;

  return (
    <div className={cn(className, "animate-fade-rise")}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
