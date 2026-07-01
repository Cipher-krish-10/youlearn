import "server-only";
import { watchUrl } from "@/lib/youtube";
import { NetworkError, VideoUnavailableError } from "@/core/errors/provider-errors";
import { withProviderLogging } from "@/core/logging/logger";

export interface VideoMetadata {
  youtubeId: string;
  url: string;
  title: string;
  channelTitle: string | null;
  thumbnailUrl: string | null;
}

interface OEmbedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

/**
 * Fetch video metadata via YouTube's public oEmbed endpoint (no API key). A
 * 401/404 means the video is private, deleted, or otherwise unavailable.
 */
export async function fetchYoutubeMetadata(
  youtubeId: string,
): Promise<VideoMetadata> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    watchUrl(youtubeId),
  )}&format=json`;

  return withProviderLogging(
    { provider: "youtube-oembed", operation: "fetchMetadata" },
    async () => {
      let res: Response;
      try {
        res = await fetch(endpoint, {
          headers: { Accept: "application/json" },
          next: { revalidate: 3600 },
        });
      } catch (err) {
        throw new NetworkError(
          "Couldn't reach YouTube. Check your connection and try again.",
          "youtube",
          { cause: err },
        );
      }

      if ([401, 403, 404].includes(res.status)) {
        throw new VideoUnavailableError(
          "This video is private, removed, or unavailable.",
          "youtube",
        );
      }
      if (!res.ok) {
        throw new NetworkError(
          "YouTube returned an unexpected response. Try again in a moment.",
          "youtube",
        );
      }

      const data = (await res.json()) as OEmbedResponse;
      return {
        youtubeId,
        url: watchUrl(youtubeId),
        title: data.title?.trim() || "Untitled video",
        channelTitle: data.author_name?.trim() || null,
        thumbnailUrl:
          data.thumbnail_url ??
          `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      };
    },
  );
}
