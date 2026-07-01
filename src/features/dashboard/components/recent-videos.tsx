"use client";

import Link from "next/link";
import { ArrowRight, Library } from "lucide-react";
import { useVideos } from "@/features/ingestion/use-ingestion";
import { Button } from "@/components/ui/button";
import { VideoGrid } from "@/components/shared/video-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { AddVideoDialog } from "@/components/shared/add-video-dialog";

export function RecentVideos() {
  const { data, isLoading, isError } = useVideos();
  const videos = data?.slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">Recent videos</h2>
        {data && data.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/library">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        isError={isError}
        skeletonCount={4}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        empty={
          <EmptyState
            icon={Library}
            title="No videos yet"
            description="Add your first video and it'll show up right here."
            action={<AddVideoDialog />}
          />
        }
      />
    </section>
  );
}
