"use client";

import { Film } from "lucide-react";
import { useVideos } from "@/features/ingestion/use-ingestion";
import { recentActivity } from "@/features/dashboard/lib/metrics";
import { timeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ActivityFeed() {
  const { data, isLoading } = useVideos();
  const items = recentActivity(data ?? []);

  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="text-sm font-medium">Recent activity</h3>

      {isLoading ? (
        <div className="mt-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No activity yet. Add a video and it&apos;ll show up here.
        </p>
      ) : (
        <div className="mt-4 space-y-1">
          {items.map((item, i) => (
            <div key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
              {i < items.length - 1 && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-border" />
              )}
              <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground">
                <Film className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm font-medium leading-tight">Added a video</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 pt-1 text-xs text-muted-foreground">
                {timeAgo(item.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
