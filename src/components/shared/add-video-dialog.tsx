"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, Check, Loader2, Play, Plus } from "lucide-react";
import { isValidYoutubeUrl } from "@/lib/youtube";
import { ApiError } from "@/features/ingestion/types";
import { useIngestVideo } from "@/features/ingestion/use-ingestion";
import { SAMPLE_URL } from "@/features/ingestion/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STEPS = [
  "Validating link",
  "Fetching video details",
  "Retrieving transcript",
  "Building workspace",
];

export function AddVideoDialog({ trigger }: { trigger?: React.ReactNode }) {
  const router = useRouter();
  const ingest = useIngestVideo();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(0);

  const trimmed = url.trim();
  const invalid = trimmed.length > 0 && !isValidYoutubeUrl(trimmed);
  const pending = ingest.isPending;

  // Advance the pipeline checklist while the request is in flight.
  useEffect(() => {
    if (!pending) return;
    setStep(1);
    const timers = [
      setTimeout(() => setStep(2), 600),
      setTimeout(() => setStep(3), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [pending]);

  function reset() {
    setUrl("");
    setStep(0);
    ingest.reset();
  }

  function onOpenChange(next: boolean) {
    if (pending) return; // don't dismiss mid-process
    setOpen(next);
    if (!next) reset();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidYoutubeUrl(trimmed)) return;
    ingest.mutate(trimmed, {
      onSuccess: (video) => {
        setOpen(false);
        reset();
        toast.success("Workspace ready", { description: video.title });
        router.push(`/workspace/${video.id}`);
      },
    });
  }

  const error = ingest.error;
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Something went wrong. Please try again."
        : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            Add video
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        {pending ? (
          <Processing step={step} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add a video</DialogTitle>
              <DialogDescription>
                Paste a YouTube link and we&apos;ll build a learning workspace
                around it.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="yt-url">YouTube URL</Label>
                <div
                  className={`flex h-9 items-center gap-2 rounded-md border bg-background px-3 transition-colors focus-within:ring-2 focus-within:ring-ring/25 ${
                    invalid ? "border-destructive" : "focus-within:border-ring"
                  }`}
                >
                  <Play className="size-3.5 shrink-0 text-muted-foreground" />
                  <input
                    id="yt-url"
                    type="url"
                    inputMode="url"
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="go"
                    aria-invalid={invalid}
                    aria-describedby={invalid ? "yt-url-error" : undefined}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=…"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                {invalid && (
                  <p
                    id="yt-url-error"
                    className="flex items-center gap-1.5 text-xs text-destructive"
                  >
                    <AlertCircle className="size-3.5" />
                    Enter a valid YouTube video link.
                  </p>
                )}
                {errorMessage && !invalid && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="size-3.5" />
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setUrl(SAMPLE_URL)}
                className="flex w-full items-center gap-2 rounded-md border bg-card px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                <Play className="size-3 shrink-0" />
                Try the sample — “Transformers, explained” by 3Blue1Brown
              </button>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!trimmed || invalid}>
                  Create workspace
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Processing({ step }: { step: number }) {
  return (
    <div className="py-2">
      <DialogHeader>
        <DialogTitle>Processing your video</DialogTitle>
        <DialogDescription>This usually takes a few seconds.</DialogDescription>
      </DialogHeader>
      <ul className="mt-5 space-y-3">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span className="flex size-5 items-center justify-center">
                {done ? (
                  <Check className="size-4 text-foreground" />
                ) : active ? (
                  <Loader2 className="size-4 animate-spin text-foreground" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                )}
              </span>
              <span
                className={
                  done || active ? "text-foreground" : "text-muted-foreground"
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
