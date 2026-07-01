"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { primaryNav, secondaryNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Shows a spinner on the link the user just clicked while the route loads. */
function NavPending() {
  const { pending } = useLinkStatus();
  return pending ? (
    <Loader2 className="ml-auto size-3.5 animate-spin text-muted-foreground" />
  ) : null;
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const renderItem = (item: (typeof primaryNav)[number]) => {
    const active =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          active
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
        )}
        <item.icon
          className={cn(
            "size-4 shrink-0",
            active ? "text-foreground" : "text-muted-foreground",
          )}
        />
        {item.label}
        <NavPending />
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {primaryNav.map(renderItem)}
        <div className="my-2 h-px bg-sidebar-border" />
        {secondaryNav.map(renderItem)}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">Free plan</p>
            <p className="truncate text-xs text-muted-foreground">
              3 of 5 videos used
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={onNavigate} asChild>
            <Link href="/settings">Upgrade</Link>
          </Button>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-3/5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
