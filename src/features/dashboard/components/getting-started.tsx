"use client";

import { useEffect, useState } from "react";
import { MessageSquareText, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddVideoDialog } from "@/components/shared/add-video-dialog";

const STORAGE_KEY = "youlearn:onboarding-dismissed";

const steps = [
  {
    icon: Plus,
    title: "Add a video",
    description: "Paste any YouTube link to spin up a workspace.",
  },
  {
    icon: Sparkles,
    title: "Generate study tools",
    description: "Summaries, notes, flashcards, and quizzes in a click.",
  },
  {
    icon: MessageSquareText,
    title: "Chat with the video",
    description: "Ask questions and get answers grounded in the transcript.",
  },
];

/**
 * First-run guidance on the dashboard. Dismissible and remembered, so it greets
 * new users without nagging returning ones.
 */
export function GettingStarted() {
  const [dismissed, setDismissed] = useState(true);

  // Read persisted state after mount to avoid hydration mismatch.
  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  return (
    <section
      aria-labelledby="getting-started-heading"
      className="relative animate-fade-rise rounded-lg border bg-card p-5 sm:p-6"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Dismiss getting started"
        onClick={dismiss}
        className="absolute right-3 top-3 size-7 text-muted-foreground"
      >
        <X className="size-4" />
      </Button>

      <div className="flex flex-col gap-1.5 pr-8">
        <h2 id="getting-started-heading" className="text-base font-medium">
          Get started with YouLearn
        </h2>
        <p className="text-sm text-muted-foreground">
          Turn your first video into a workspace in three steps.
        </p>
      </div>

      <ol className="mt-5 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
              <step.icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">
                <span className="mr-1.5 text-muted-foreground tabular-nums">
                  {i + 1}.
                </span>
                {step.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center gap-2">
        <AddVideoDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              Add your first video
            </Button>
          }
        />
        <Button size="sm" variant="ghost" onClick={dismiss}>
          Skip for now
        </Button>
      </div>
    </section>
  );
}
