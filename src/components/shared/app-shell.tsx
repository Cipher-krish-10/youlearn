"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { AuthUser } from "@/features/auth/types";
import { Logo } from "@/components/shared/logo";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { AppTopbar } from "@/components/shared/app-topbar";
import { Button } from "@/components/ui/button";

export function AppShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-14 items-center px-4">
          <Logo />
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && [
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/30 lg:hidden"
          />,
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-sidebar lg:hidden"
          >
            <div className="flex h-14 items-center justify-between px-4">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </motion.aside>,
        ]}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-60">
        <AppTopbar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main
          id="main-content"
          key={pathname}
          className="animate-fade-rise px-4 py-6 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
