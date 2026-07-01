"use client";

import type { ReactNode } from "react";
import { Loader2, Sparkles, ScrollText, RefreshCw, type LucideIcon } from "lucide-react";
import { AiRequestError } from "@/features/ai/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ArtifactStateProps {
  label: string;
  icon: LucideIcon;
  transcriptReady: boolean;
  isGenerated: boolean;
  isBusy: boolean;
  error: unknown;
  onGenerate: () => void;
  children: ReactNode;
}

/**
 * Owns the loading / empty / error / ready lifecycle for one AI artifact, so
 * each panel just supplies a generate handler and the rendered data. No model
 * or prompt logic lives here — that's all in the server services.
 */
export function ArtifactState({
  label,
  icon: Icon,
  transcriptReady,
  isGenerated,
  isBusy,
  error,
  onGenerate,
  children,
}: ArtifactStateProps) {
  if (!transcriptReady) {
    return (
      <Centered
        icon={ScrollText}
        title="Transcript required"
        description={`AI ${label} is generated from the transcript. This video doesn't have one available yet.`}
      />
    );
  }

  if (isBusy && !isGenerated) {
    return <GeneratingState label={label} />;
  }

  if (error && !isGenerated) {
    return <ErrorState label={label} error={error} onRetry={onGenerate} />;
  }

  if (isGenerated) {
    return (
      <div>
        <div className="mb-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
            <Sparkles className="size-3" />
            AI generated
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGenerate}
            disabled={isBusy}
          >
            {isBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Regenerate
          </Button>
        </div>
        {children}
      </div>
    );
  }

  // Not generated yet → invite generation.
  return (
    <Centered
      icon={Icon}
      title={`Generate ${label}`}
      description={`Create ${label} from this video's transcript with AI.`}
      action={
        <Button onClick={onGenerate}>
          <Sparkles className="size-4" />
          Generate {label}
        </Button>
      }
    />
  );
}

function GeneratingState({ label }: { label: string }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Generating {label}…
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[78%]" />
        <Skeleton className="mt-6 h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
      </div>
    </div>
  );
}

function ErrorState({
  label,
  error,
  onRetry,
}: {
  label: string;
  error: unknown;
  onRetry: () => void;
}) {
  const notConfigured =
    error instanceof AiRequestError && error.code === "NOT_CONFIGURED";

  if (notConfigured) {
    return (
      <Centered
        icon={Sparkles}
        title="Connect OpenAI to generate"
        description="AI features need an OpenAI API key. Add it to your environment and restart the dev server."
        action={
          <code className="rounded-md border bg-muted/50 px-3 py-1.5 font-mono text-xs">
            OPENAI_API_KEY=sk-…
          </code>
        }
      />
    );
  }

  const message =
    error instanceof AiRequestError
      ? error.message
      : `We couldn't generate ${label}. Please try again.`;

  return (
    <Centered
      icon={Sparkles}
      title={`Couldn't generate ${label}`}
      description={message}
      action={
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      }
    />
  );
}

function Centered({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
