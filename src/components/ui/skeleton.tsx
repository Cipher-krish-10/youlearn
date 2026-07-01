import { cn } from "@/lib/utils";

/**
 * Shimmering placeholder. A muted base with a slow sheen sweeping across —
 * reads as "loading" without the harsh strobing of a plain pulse.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-md bg-muted/70", className)}
      {...props}
    />
  );
}

export { Skeleton };
