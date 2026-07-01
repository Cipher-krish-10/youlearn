import {
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { learningStats } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

const stats: Stat[] = [
  {
    label: "Videos completed",
    value: String(learningStats.videosCompleted),
    icon: CheckCircle2,
    trend: "+6 this week",
  },
  {
    label: "Hours studied",
    value: String(learningStats.hoursStudied),
    icon: Clock,
    trend: "+4.5 this week",
  },
  {
    label: "Flashcards mastered",
    value: String(learningStats.flashcardsMastered),
    icon: Layers,
    trend: "+28 this week",
  },
  {
    label: "Day streak",
    value: String(learningStats.currentStreak),
    icon: Flame,
    trend: "Keep it going!",
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg border lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            "bg-card p-5",
            "border-border",
            i % 2 === 0 && "border-r",
            i < 2 && "border-b lg:border-b-0",
            i === 1 && "lg:border-r",
            i === 2 && "lg:border-r",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <stat.icon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
            {stat.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{stat.trend}</div>
        </div>
      ))}
    </div>
  );
}
