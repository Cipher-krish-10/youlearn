"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { UpgradeDialog } from "@/features/billing/upgrade-dialog";

/**
 * App-wide client providers, composed in one place and mounted from the root
 * layout. Order matters: theme wraps everything so toasts pick up dark mode.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        {children}
        <UpgradeDialog />
        <Toaster richColors position="top-center" />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
