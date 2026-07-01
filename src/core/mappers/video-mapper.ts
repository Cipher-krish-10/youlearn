import type { VideoEntity } from "@/core/types/entities";
import type { TranscriptSegment } from "@/core/types/transcript";
import type { TranscriptLineDTO, VideoDTO } from "@/features/ingestion/types";

/** Map a domain entity to the API transport shape (dates → ISO strings). */
export function toVideoDTO(v: VideoEntity): VideoDTO {
  return {
    id: v.id,
    youtubeId: v.youtubeId,
    url: v.url,
    title: v.title,
    channelTitle: v.channelTitle,
    thumbnailUrl: v.thumbnailUrl,
    durationSec: v.durationSec,
    status: v.status,
    transcriptStatus: v.transcriptStatus,
    transcriptSource: v.transcriptSource,
    isSample: v.isSample,
    createdAt: v.createdAt.toISOString(),
  };
}

export function toTranscriptDTO(
  segments: TranscriptSegment[],
): TranscriptLineDTO[] {
  return segments.map((s) => ({
    startSec: s.startSec,
    endSec: s.endSec,
    text: s.text,
  }));
}
