import { formatTimestamp } from "@/lib/utils";

export function WorkspacePlayer({
  youtubeId,
  title,
  channel,
  durationSec,
}: {
  youtubeId: string;
  title: string;
  channel: string | null;
  durationSec: number;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-lg border bg-black">
        <div className="relative aspect-video">
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-lg font-semibold leading-snug tracking-tight">
          {title}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          {channel && <span className="text-foreground">{channel}</span>}
          {channel && durationSec > 0 && <span>·</span>}
          {durationSec > 0 && (
            <span className="tabular-nums">{formatTimestamp(durationSec)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
