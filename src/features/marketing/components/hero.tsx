"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const transition = { duration: 0.4, ease: "easeOut" } as const;

export function Hero() {
  return (
    <section className="border-b">
      <div className="container pb-16 pt-32 sm:pb-24 sm:pt-36">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-medium text-foreground">New</span>
              <span className="h-3 w-px bg-border" />
              Grounded answers cite the exact timestamp
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.05 }}
            className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Turn any YouTube video into a learning workspace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Summaries, searchable transcripts, flashcards, quizzes, and a tutor
            that actually knows the video — in one focused place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.15 }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-2.5 sm:flex-row"
          >
            <div className="flex h-9 flex-1 items-center gap-2 rounded-md border bg-background px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25">
              <Play className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                readOnly
                value="youtube.com/watch?v=…"
                aria-label="YouTube URL"
                className="w-full bg-transparent text-sm text-muted-foreground outline-none"
              />
            </div>
            <Button asChild>
              <Link href="/signup">Start learning</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: 0.2 }}
            className="mt-3 text-xs text-muted-foreground"
          >
            Free to start · No credit card required
          </motion.p>
        </div>

        {/* Restrained product preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <div className="flex h-9 items-center gap-1.5 border-b bg-muted/40 px-3.5">
              <span className="size-2.5 rounded-full border" />
              <span className="size-2.5 rounded-full border" />
              <span className="size-2.5 rounded-full border" />
              <span className="ml-2 text-xs text-muted-foreground">
                learntube.app
              </span>
            </div>
            <HeroPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="grid divide-y sm:grid-cols-[1.5fr_1fr] sm:divide-x sm:divide-y-0">
      <div className="p-5">
        <div className="flex aspect-video items-center justify-center rounded-md border bg-muted/50">
          <Play className="size-7 text-muted-foreground/70" />
        </div>
        <h3 className="mt-4 text-sm font-medium">
          Transformers, explained: how LLMs actually work
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">3Blue1Brown · 27:00</p>
        <div className="mt-4 space-y-1.5">
          {[
            { t: "1:07", s: "What am I looking for, what do I offer…" },
            { t: "1:26", s: "Those are the query, key, and value vectors." },
            { t: "1:49", s: "Attention compares queries against keys." },
          ].map((line, i) => (
            <div
              key={line.t}
              className={`flex gap-2.5 rounded px-2 py-1 text-xs ${
                i === 1 ? "bg-accent text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                {line.t}
              </span>
              <span className="truncate">{line.s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col p-5">
        <span className="text-xs font-medium text-muted-foreground">
          AI Tutor
        </span>
        <div className="mt-3 space-y-2.5">
          <div className="ml-auto max-w-[85%] rounded-md rounded-tr-sm bg-primary px-3 py-2 text-xs text-primary-foreground">
            Difference between a key and a value?
          </div>
          <div className="max-w-[92%] rounded-md rounded-tl-sm border bg-background px-3 py-2 text-xs">
            The key decides how much attention a token receives; the value is
            the information that flows through once it&apos;s selected.
            <span className="mt-1.5 block font-mono text-[11px] text-muted-foreground">
              Cited 1:26, 2:34
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
