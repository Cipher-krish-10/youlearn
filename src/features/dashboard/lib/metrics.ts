import type { VideoDTO } from "@/features/ingestion/types";

const DAY_MS = 86_400_000;

export interface DashboardStats {
  total: number;
  ready: number;
  hoursLabel: string;
  addedThisWeek: number;
}

/** Aggregate counts from the user's real library. */
export function computeStats(videos: VideoDTO[]): DashboardStats {
  const ready = videos.filter((v) => v.transcriptStatus === "ready").length;
  const totalSec = videos.reduce((s, v) => s + (v.durationSec ?? 0), 0);
  const weekAgo = Date.now() - 7 * DAY_MS;
  const addedThisWeek = videos.filter(
    (v) => new Date(v.createdAt).getTime() >= weekAgo,
  ).length;
  const hoursLabel =
    totalSec < 3600
      ? `${Math.round(totalSec / 60)}m`
      : `${(totalSec / 3600).toFixed(1)}h`;
  return { total: videos.length, ready, hoursLabel, addedThisWeek };
}

export interface DayBucket {
  day: string;
  count: number;
  today: boolean;
}

/** Videos added per day over the trailing 7 days (oldest → today). */
export function perDayThisWeek(videos: VideoDTO[]): DayBucket[] {
  const buckets: DayBucket[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const start = base.getTime() - i * DAY_MS;
    const end = start + DAY_MS;
    const count = videos.filter((v) => {
      const t = new Date(v.createdAt).getTime();
      return t >= start && t < end;
    }).length;
    buckets.push({
      day: new Date(start).toLocaleDateString(undefined, { weekday: "short" }),
      count,
      today: i === 0,
    });
  }
  return buckets;
}

export interface ActivityEntry {
  id: string;
  detail: string;
  createdAt: string;
}

/** Most recent videos, as activity events. */
export function recentActivity(videos: VideoDTO[]): ActivityEntry[] {
  return videos
    .slice(0, 6)
    .map((v) => ({ id: v.id, detail: v.title, createdAt: v.createdAt }));
}
