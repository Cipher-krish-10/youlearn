import "server-only";
import { extractYoutubeId } from "@/lib/youtube";
import type { VideoRepository } from "@/core/interfaces/repositories";
import type { TranscriptProvider } from "@/core/interfaces/transcript-provider";
import type { VideoEntity } from "@/core/types/entities";
import { InvalidInputError, ProviderError } from "@/core/errors/provider-errors";
import { fetchYoutubeMetadata } from "@/core/services/youtube-metadata";

/**
 * URL → validate → metadata → transcript → persist. Depends only on the
 * VideoRepository and TranscriptProvider interfaces, so swapping either is a
 * factory change. A missing transcript is not a failure: the workspace still
 * opens with playable video and metadata.
 */
export class IngestionService {
  constructor(
    private readonly videos: VideoRepository,
    private readonly transcripts: TranscriptProvider,
  ) {}

  async ingest(input: { url: string; userId: string }): Promise<VideoEntity> {
    const youtubeId = extractYoutubeId(input.url);
    if (!youtubeId) {
      throw new InvalidInputError(
        "That doesn't look like a YouTube video URL.",
        "INVALID_URL",
      );
    }

    const existing = await this.videos.getByYoutubeId(youtubeId, input.userId);
    if (existing && existing.status === "READY") return existing;

    // Metadata failures (private/removed/network) are genuine errors.
    const meta = await fetchYoutubeMetadata(youtubeId);
    const video =
      existing ??
      (await this.videos.create({
        userId: input.userId,
        youtubeId,
        url: meta.url,
        title: meta.title,
        channelTitle: meta.channelTitle,
        thumbnailUrl: meta.thumbnailUrl,
      }));

    const base = {
      title: meta.title,
      channelTitle: meta.channelTitle,
      thumbnailUrl: meta.thumbnailUrl,
    };

    try {
      const { segments } = await this.transcripts.getTranscript(youtubeId);
      await this.videos.saveTranscript(video.id, segments);
      const last = segments.at(-1);
      await this.videos.update(video.id, {
        ...base,
        status: "READY",
        transcriptStatus: "ready",
        transcriptSource: "captions",
        durationSec: last ? Math.round(last.endSec) : null,
      });
    } catch (err) {
      // Any transcript-provider failure → still a usable, metadata-only workspace.
      if (err instanceof ProviderError) {
        await this.videos.update(video.id, {
          ...base,
          status: "READY",
          transcriptStatus: "unavailable",
          transcriptSource: null,
        });
      } else {
        await this.videos.update(video.id, { status: "FAILED" });
        throw err;
      }
    }

    return (await this.videos.get(video.id)) ?? video;
  }
}
