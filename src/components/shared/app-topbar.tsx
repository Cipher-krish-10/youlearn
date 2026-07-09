"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/mode-toggle";
import type { AuthUser } from "@/features/auth/types";
import { UserMenu } from "@/components/shared/user-menu";
import { AddVideoDialog } from "@/components/shared/add-video-dialog";
import { SearchDialog } from "@/components/shared/search-dialog";

export function AppTopbar({
  user,
  onMenuClick,
}: {
  user: AuthUser;
  onMenuClick: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <Menu />
      </Button>

      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="group flex h-10 flex-1 items-center gap-2.5 rounded-lg border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:max-w-md"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search videos and notes…</span>
        <kbd className="hidden items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </button>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden sm:block">
          <AddVideoDialog />
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>
        <ModeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
