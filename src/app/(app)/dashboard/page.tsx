import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { displayName } from "@/features/auth/types";
import { AddVideoDialog } from "@/components/shared/add-video-dialog";
import { StatCards } from "@/features/dashboard/components/stat-cards";
import { WeeklyStreak } from "@/features/dashboard/components/weekly-streak";
import { ActivityFeed } from "@/features/dashboard/components/activity-feed";
import { RecentVideos } from "@/features/dashboard/components/recent-videos";
import { GettingStarted } from "@/features/dashboard/components/getting-started";

export const metadata: Metadata = { title: "Home" };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  const firstName = user ? displayName(user) : "there";

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Greeting */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick up where you left off, or add something new to learn.
          </p>
        </div>
        <div className="sm:hidden">
          <AddVideoDialog />
        </div>
      </div>

      <GettingStarted />

      {/* Real, persisted videos */}
      <RecentVideos />

      <StatCards />

      {/* Streak + activity */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <WeeklyStreak />
        <ActivityFeed />
      </div>
    </div>
  );
}
