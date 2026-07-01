import { Flame } from "lucide-react";
import { weeklyStreak } from "@/lib/mock/data";

export function WeeklyStreak() {
  const max = Math.max(...weeklyStreak.map((d) => d.minutes), 1);

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">This week</h3>
          <p className="text-sm text-muted-foreground">Minutes learned per day</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Flame className="size-3.5" />5 day streak
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-2 sm:gap-3">
        {weeklyStreak.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-24 w-full items-end">
              <div
                className={`w-full rounded-sm transition-all ${
                  d.active ? "bg-primary/85" : "bg-muted"
                }`}
                style={{
                  height: `${Math.max((d.minutes / max) * 100, d.active ? 8 : 4)}%`,
                }}
                title={`${d.minutes} min`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
