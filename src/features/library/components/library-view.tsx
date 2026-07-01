"use client";

import { Library } from "lucide-react";
import { useVideos } from "@/features/ingestion/use-ingestion";
import { PageHeader } from "@/components/shared/page-header";
import { AddVideoDialog } from "@/components/shared/add-video-dialog";
import { VideoGrid } from "@/components/shared/video-grid";
import { EmptyState } from "@/components/shared/empty-state";

export function LibraryView() {
  const { data: videos, isLoading, isError } = useVideos();
  const count = videos?.length ?? 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="My Videos"
        description={
          isLoading
            ? "Loading your library…"
            : `${count} ${count === 1 ? "video" : "videos"} in your library`
        }
        action={<AddVideoDialog />}
      />

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        isError={isError}
        empty={
          <EmptyState
            icon={Library}
            title="No videos yet"
            description="Paste a YouTube link to build your first learning workspace."
            action={<AddVideoDialog />}
          />
        }
      />
    </div>
  );
}
