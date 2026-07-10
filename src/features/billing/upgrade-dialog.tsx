"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { QUOTA_EXCEEDED_EVENT } from "@/features/billing/quota-events";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Shown whenever any API call reports QUOTA_EXCEEDED. Mounted once in the
 * global providers; listens for the event fired by the shared API client.
 */
export function UpgradeDialog() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function onQuotaExceeded(e: Event) {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setMessage(
        detail?.message ??
          "You've reached your free plan limit for this month.",
      );
    }
    window.addEventListener(QUOTA_EXCEEDED_EVENT, onQuotaExceeded);
    return () =>
      window.removeEventListener(QUOTA_EXCEEDED_EVENT, onQuotaExceeded);
  }, []);

  return (
    <Dialog open={message !== null} onOpenChange={(o) => !o && setMessage(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>
          <DialogTitle className="text-center">
            You&apos;ve hit your free plan limit
          </DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/#pricing" onClick={() => setMessage(null)}>
              See plans
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setMessage(null)}
          >
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
