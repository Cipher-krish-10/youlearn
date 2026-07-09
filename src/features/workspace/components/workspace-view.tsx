"use client";

import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Layers,
  ListChecks,
  ScrollText,
  Share2,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { ApiError } from "@/features/ingestion/types";
import { useTranscript, useVideo } from "@/features/ingestion/use-ingestion";
import { Logo } from "@/components/shared/logo";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceSkeleton } from "@/components/shared/skeletons";
import { WorkspacePlayer } from "@/features/workspace/components/workspace-player";
import { SummaryPanel } from "@/features/workspace/components/summary-panel";
import { TranscriptPanel } from "@/features/workspace/components/transcript-panel";
import { NotesPanel } from "@/features/workspace/components/notes-panel";
import { FlashcardsPanel } from "@/features/workspace/components/flashcards-panel";
import { QuizPanel } from "@/features/workspace/components/quiz-panel";
import { TutorChat } from "@/features/workspace/components/tutor-chat";
import { TranscriptUnavailable } from "@/features/workspace/components/transcript-unavailable";
import { AddToCollection } from "@/features/collections/components/add-to-collection";

export function WorkspaceView({ videoId }: { videoId: string }) {
  const videoQuery = useVideo(videoId);
  const transcriptQuery = useTranscript(
    videoId,
    videoQuery.data?.transcriptStatus === "ready",
  );

  if (videoQuery.isLoading) return <WorkspaceSkeleton />;

  if (videoQuery.isError || !videoQuery.data) {
    const notFound =
      videoQuery.error instanceof ApiError && videoQuery.error.status === 404;
    return <WorkspaceMissing notFound={notFound} />;
  }

  const video = videoQuery.data;
  const transcriptReady = video.transcriptStatus === "ready";

  const transcriptError =
    transcriptQuery.error instanceof ApiError
      ? transcriptQuery.error.message
      : transcriptQuery.error
        ? "We couldn't load the transcript for this video."
        : null;

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/library" aria-label="Back to library">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="hidden sm:block">
          <Logo showWordmark={false} />
        </div>
        <span className="truncate text-sm text-muted-foreground">
          {video.channelTitle ?? "YouTube"}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="hidden sm:inline-flex">
            <AddToCollection videoId={video.id} />
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Share"
            onClick={() => toast.success("Workspace link copied")}
          >
            <Share2 />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
            <WorkspacePlayer
              youtubeId={video.youtubeId}
              title={video.title}
              channel={video.channelTitle}
              durationSec={video.durationSec ?? 0}
            />

            <Tabs defaultValue="transcript" className="mt-8">
              <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto p-1">
                <TabsTrigger value="transcript">
                  <ScrollText />
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="summary">
                  <FileText />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <StickyNote />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="flashcards">
                  <Layers />
                  Flashcards
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  <ListChecks />
                  Quiz
                </TabsTrigger>
                <TabsTrigger value="tutor" className="xl:hidden">
                  <Sparkles />
                  Tutor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="mt-6">
                {video.transcriptStatus === "ready" ? (
                  <div className="min-h-[50vh]">
                    <TranscriptPanel
                      lines={transcriptQuery.data ?? []}
                      isLoading={transcriptQuery.isLoading}
                      errorMessage={transcriptError}
                    />
                  </div>
                ) : (
                  <TranscriptUnavailable />
                )}
              </TabsContent>

              <TabsContent value="summary" className="mt-6">
                <SummaryPanel
                  videoId={video.id}
                  transcriptReady={transcriptReady}
                />
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <NotesPanel
                  videoId={video.id}
                  transcriptReady={transcriptReady}
                />
              </TabsContent>

              <TabsContent value="flashcards" className="mt-6">
                <FlashcardsPanel
                  videoId={video.id}
                  transcriptReady={transcriptReady}
                />
              </TabsContent>

              <TabsContent value="quiz" className="mt-6">
                <QuizPanel
                  videoId={video.id}
                  transcriptReady={transcriptReady}
                />
              </TabsContent>

              <TabsContent value="tutor" className="mt-6 xl:hidden">
                <div className="h-[70vh] overflow-hidden rounded-lg border">
                  <TutorChat
                    videoId={video.id}
                    transcriptReady={transcriptReady}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <aside className="hidden min-h-0 border-l xl:flex xl:flex-col">
          <TutorChat videoId={video.id} transcriptReady={transcriptReady} />
        </aside>
      </div>
    </div>
  );
}

function WorkspaceMissing({ notFound }: { notFound: boolean }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="absolute left-4 top-4">
        <Logo />
      </div>
      <h1 className="text-lg font-semibold">
        {notFound ? "Workspace not found" : "Couldn't load this workspace"}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {notFound
          ? "This video isn't in your library. It may have been removed, or the link is no longer valid."
          : "Something went wrong loading this video. Please try again."}
      </p>
      <Button asChild className="mt-6">
        <Link href="/library">
          <ArrowLeft className="size-4" />
          Back to library
        </Link>
      </Button>
    </div>
  );
}
