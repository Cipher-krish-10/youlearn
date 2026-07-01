import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { VideoDTO } from "@/features/ingestion/types";
import { cn, focusRing, formatTimestamp, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function VideoCard({ video }: { video: VideoDTO }) {
  return (
    <Link
      href={`/workspace/${video.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/20",
        focusRing,
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/50">
            <Play className="size-7" />
          </div>
        )}
        {video.durationSec ? (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-background/90 px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums">
            {formatTimestamp(video.durationSec)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        {video.transcriptStatus === "unavailable" && (
          <Badge variant="outline" className="w-fit">
            No transcript
          </Badge>
        )}
        <h3
          className={cn(
            "line-clamp-2 text-sm font-medium leading-snug",
            video.transcriptStatus === "unavailable" && "mt-2",
          )}
        >
          {video.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span className="truncate">{video.channelTitle ?? "YouTube"}</span>
          <span className="shrink-0">{timeAgo(video.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
