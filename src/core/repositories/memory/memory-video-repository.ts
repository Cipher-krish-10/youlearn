import "server-only";
import type { VideoRepository } from "@/core/interfaces/repositories";
import type { NewVideo, VideoEntity } from "@/core/types/entities";
import type { TranscriptSegment } from "@/core/types/transcript";

/** In-memory, user-scoped VideoRepository. Held as a singleton by the factory. */
export class MemoryVideoRepository implements VideoRepository {
  private videos = new Map<string, VideoEntity>();
  private transcripts = new Map<string, TranscriptSegment[]>();

  async create(input: NewVideo): Promise<VideoEntity> {
    const video: VideoEntity = {
      id: crypto.randomUUID(),
      userId: input.userId,
      youtubeId: input.youtubeId,
      url: input.url,
      title: input.title,
      channelTitle: input.channelTitle,
      thumbnailUrl: input.thumbnailUrl,
      durationSec: null,
      status: "PROCESSING",
      transcriptStatus: "unavailable",
      transcriptSource: null,
      isSample: false,
      createdAt: new Date(),
    };
    this.videos.set(video.id, video);
    return video;
  }

  async get(id: string): Promise<VideoEntity | null> {
    return this.videos.get(id) ?? null;
  }

  async getByYoutubeId(
    youtubeId: string,
    userId: string,
  ): Promise<VideoEntity | null> {
    for (const v of this.videos.values()) {
      if (v.youtubeId === youtubeId && v.userId === userId) return v;
    }
    return null;
  }

  async list(userId: string): Promise<VideoEntity[]> {
    return [...this.videos.values()]
      .filter((v) => v.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(id: string, patch: Partial<VideoEntity>): Promise<void> {
    const existing = this.videos.get(id);
    if (existing) this.videos.set(id, { ...existing, ...patch });
  }

  async saveTranscript(
    videoId: string,
    segments: TranscriptSegment[],
  ): Promise<void> {
    this.transcripts.set(videoId, segments);
  }

  async getTranscript(videoId: string): Promise<TranscriptSegment[] | null> {
    return this.transcripts.get(videoId) ?? null;
  }
}
