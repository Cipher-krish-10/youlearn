import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SAMPLE_WORKSPACE_PATH } from "@/features/ingestion/constants";
import { Button } from "@/components/ui/button";

/**
 * Friendly onboarding state shown when a real video's transcript can't be
 * retrieved yet (the hosted transcript provider isn't configured). Deliberately
 * not styled like an error — playback and metadata work; transcripts are en route.
 */
export function TranscriptUnavailable() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center">
      <TranscriptIllustration />

      <span className="mt-7 inline-flex items-center rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
        Rolling out
      </span>

      <h3 className="mt-3 text-lg font-semibold tracking-tight">
        Transcripts are on the way for this video
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We&apos;re finishing our integration with a transcript provider. The
        title, channel, and player above are ready now — full transcripts for
        any link land shortly. In the meantime, the sample workspace shows the
        complete experience end to end.
      </p>

      <div className="mt-7 flex flex-col items-center gap-2.5 sm:flex-row">
        <Button asChild>
          <Link href={SAMPLE_WORKSPACE_PATH}>
            Open the sample workspace
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/library">Back to library</Link>
        </Button>
      </div>
    </div>
  );
}

/** Restrained line-art illustration of a transcript, in the app's palette. */
function TranscriptIllustration() {
  return (
    <svg
      width="168"
      height="120"
      viewBox="0 0 168 120"
      fill="none"
      role="img"
      aria-label="Transcript illustration"
      className="text-muted-foreground"
    >
      {/* document panel */}
      <rect
        x="30.5"
        y="14.5"
        width="107"
        height="91"
        rx="9.5"
        className="fill-card stroke-border"
      />
      {/* timestamped rows */}
      {[34, 50, 66, 82].map((y, i) => (
        <g key={y} className="stroke-border" strokeWidth="2.5" strokeLinecap="round">
          <line x1="44" y1={y} x2="56" y2={y} className="stroke-muted-foreground/50" />
          <line
            x1="64"
            y1={y}
            x2={i === 1 ? 110 : 124}
            y2={y}
            className="stroke-muted-foreground/30"
          />
        </g>
      ))}
      {/* highlighted (active) row */}
      <line
        x1="64"
        y1="50"
        x2="110"
        y2="50"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* play badge */}
      <circle cx="121" cy="92" r="15" className="fill-primary" />
      <path d="M117 86.5 L127 92 L117 97.5 Z" className="fill-primary-foreground" />
    </svg>
  );
}
