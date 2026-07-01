import "server-only";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/core/providers/database/prisma-client";
import type { VideoRepository } from "@/core/interfaces/repositories";
import type {
  NewVideo,
  TranscriptStatus,
  VideoEntity,
} from "@/core/types/entities";
import type { TranscriptSegment } from "@/core/types/transcript";

type Row = Prisma.VideoGetPayload<object>;

function toEntity(v: Row): VideoEntity {
  return {
    id: v.id,
    userId: v.userId,
    youtubeId: v.youtubeId,
    url: v.url,
    title: v.title,
    channelTitle: v.channelTitle,
    thumbnailUrl: v.thumbnailUrl,
    durationSec: v.durationSec,
    status: v.status,
    transcriptStatus: v.transcriptStatus as TranscriptStatus,
    transcriptSource: v.transcriptSource as VideoEntity["transcriptSource"],
    isSample: v.isSample,
    createdAt: v.createdAt,
  };
}

/** Prisma VideoRepository. Stores the display transcript as JSON on the row. */
export class PrismaVideoRepository implements VideoRepository {
  async create(input: NewVideo): Promise<VideoEntity> {
    const v = await prisma.video.create({
      data: {
        userId: input.userId,
        youtubeId: input.youtubeId,
        url: input.url,
        title: input.title,
        channelTitle: input.channelTitle,
        thumbnailUrl: input.thumbnailUrl,
        status: "PROCESSING",
        transcriptStatus: "unavailable",
      },
    });
    return toEntity(v);
  }

  async get(id: string): Promise<VideoEntity | null> {
    const v = await prisma.video.findUnique({ where: { id } });
    return v ? toEntity(v) : null;
  }

  async getByYoutubeId(
    youtubeId: string,
    userId: string,
  ): Promise<VideoEntity | null> {
    const v = await prisma.video.findFirst({ where: { youtubeId, userId } });
    return v ? toEntity(v) : null;
  }

  async list(userId: string): Promise<VideoEntity[]> {
    const rows = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toEntity);
  }

  async update(id: string, patch: Partial<VideoEntity>): Promise<void> {
    const data: Prisma.VideoUpdateInput = {};
    if (patch.title !== undefined) data.title = patch.title;
    if (patch.channelTitle !== undefined) data.channelTitle = patch.channelTitle;
    if (patch.thumbnailUrl !== undefined) data.thumbnailUrl = patch.thumbnailUrl;
    if (patch.durationSec !== undefined) data.durationSec = patch.durationSec;
    if (patch.status !== undefined) data.status = patch.status;
    if (patch.transcriptStatus !== undefined)
      data.transcriptStatus = patch.transcriptStatus;
    if (patch.transcriptSource !== undefined)
      data.transcriptSource = patch.transcriptSource;
    await prisma.video.update({ where: { id }, data });
  }

  async saveTranscript(
    videoId: string,
    segments: TranscriptSegment[],
  ): Promise<void> {
    await prisma.video.update({
      where: { id: videoId },
      data: { transcript: segments as unknown as Prisma.InputJsonValue },
    });
  }

  async getTranscript(videoId: string): Promise<TranscriptSegment[] | null> {
    const v = await prisma.video.findUnique({
      where: { id: videoId },
      select: { transcript: true },
    });
    if (!v?.transcript) return null;
    return v.transcript as unknown as TranscriptSegment[];
  }
}
