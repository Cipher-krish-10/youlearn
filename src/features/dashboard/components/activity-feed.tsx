import {
  CheckCircle2,
  FileText,
  Layers,
  ListChecks,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { mockActivity, type ActivityItem } from "@/lib/mock/data";

const iconMap: Record<ActivityItem["type"], LucideIcon> = {
  summary: FileText,
  quiz: ListChecks,
  flashcards: Layers,
  note: StickyNote,
  completed: CheckCircle2,
};

export function ActivityFeed() {
  return (
    <div className="rounded-lg border bg-card p-5">
      <h3 className="text-sm font-medium">Recent activity</h3>
      <div className="mt-4 space-y-1">
        {mockActivity.map((item, i) => {
          const Icon = iconMap[item.type];
          return (
            <div key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
              {/* timeline line */}
              {i < mockActivity.length - 1 && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-border" />
              )}
              <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm font-medium leading-tight">
                  {item.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 pt-1 text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
