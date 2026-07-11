import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand mark: a knowledge graph rising into an arrow — nodes of understanding
 * connecting upward. Drawn in the same stroke style as the app's icon set.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2.2 19.2 6.2 12.4 11.4 16.6 19.8 5.4" />
      <polyline points="15.2 5.4 19.8 5.4 19.8 10" />
      <circle cx="6.2" cy="12.4" r="2.1" fill="currentColor" stroke="none" />
      <circle cx="11.4" cy="16.6" r="2.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
  showWordmark = true,
}: {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-semibold", className)}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <LogoMark className="size-[15px]" />
      </span>
      {showWordmark && (
        <span className="text-[15px] tracking-tight">YouLearn</span>
      )}
    </Link>
  );
}
