"use client";

import { CalendarDays, Clock, Film, ScrollText, type LucideIcon } from "lucide-react";
import { useVideos } from "@/features/ingestion/use-ingestion";
import { computeStats } from "@/features/dashboard/lib/metrics";
import { cn } from "@/lib/utils";

export function StatCards() {
  const { data, isLoading } = useVideos();
  const s = computeStats(data ?? []);
  const dash = isLoading ? "—" : undefined;

  const stats: { label: string; value: string; icon: LucideIcon; sub: string }[] =
    [
      {
        label: "Videos",
        value: dash ?? String(s.total),
        icon: Film,
        sub: `${s.addedThisWeek} added this week`,
      },
      {
        label: "Transcribed",
        value: dash ?? String(s.ready),
        icon: ScrollText,
        sub: `of ${s.total} in library`,
      },
      {
        label: "Hours of content",
        value: dash ?? s.hoursLabel,
        icon: Clock,
        sub: "across your library",
      },
      {
        label: "Added this week",
        value: dash ?? String(s.addedThisWeek),
        icon: CalendarDays,
        sub: "in the last 7 days",
      },
    ];

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg border lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            "bg-card p-5",
            i % 2 === 0 && "border-r",
            i < 2 && "border-b lg:border-b-0",
            (i === 1 || i === 2) && "lg:border-r",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <stat.icon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
            {stat.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}
