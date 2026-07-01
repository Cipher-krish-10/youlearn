import "server-only";
import { getVideoRepository } from "@/core/container";
import { NotFoundError } from "@/core/errors/provider-errors";
import type { VideoEntity } from "@/core/types/entities";

/**
 * Load a video and assert the given user owns it. Throws a 404-mapped error
 * otherwise (so we don't reveal that someone else's video exists).
 */
export async function getOwnedVideo(
  videoId: string,
  userId: string,
): Promise<VideoEntity> {
  const video = await getVideoRepository().get(videoId);
  if (!video || video.userId !== userId) {
    throw new NotFoundError("We couldn't find that video.");
  }
  return video;
}
