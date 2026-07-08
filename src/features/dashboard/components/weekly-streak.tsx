"use client";

import { useVideos } from "@/features/ingestion/use-ingestion";
import { perDayThisWeek } from "@/features/dashboard/lib/metrics";
import { cn } from "@/lib/utils";

export function WeeklyStreak() {
  const { data } = useVideos();
  const buckets = perDayThisWeek(data ?? []);
  const max = Math.max(...buckets.map((d) => d.count), 1);
  const total = buckets.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">This week</h3>
          <p className="text-sm text-muted-foreground">Videos added per day</p>
        </div>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {total} this week
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-2 sm:gap-3">
        {buckets.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-24 w-full items-end">
              <div
                className={cn(
                  "w-full rounded-sm transition-all",
                  d.count > 0 ? "bg-primary/85" : "bg-muted",
                  d.today && d.count > 0 && "bg-primary",
                )}
                style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
                title={`${d.count} video${d.count === 1 ? "" : "s"}`}
              />
            </div>
            <span
              className={cn(
                "text-xs",
                d.today ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
