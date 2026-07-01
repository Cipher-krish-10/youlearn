import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

/**
 * Shown for AI features (summary, quiz, …) on a freshly-ingested video. The
 * transcript is saved; generating these from it lands in later milestones.
 */
export function NotGenerated({
  icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <EmptyState
      icon={icon}
      title={`No ${label} yet`}
      description={`The transcript is ready. Generating ${label} from it is coming soon.`}
    />
  );
}
