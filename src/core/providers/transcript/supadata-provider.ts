import "server-only";
import type { TranscriptProvider } from "@/core/interfaces/transcript-provider";
import type {
  TranscriptResult,
  TranscriptSegment,
} from "@/core/types/transcript";
import {
  AuthenticationError,
  NetworkError,
  ProviderUnavailableError,
  RateLimitError,
  TranscriptUnavailableError,
} from "@/core/errors/provider-errors";
import { withProviderLogging } from "@/core/logging/logger";
import { getServerEnv } from "@/lib/env";
import { watchUrl } from "@/lib/youtube";

interface SupadataSegment {
  text?: string;
  offset?: number;
  start?: number;
  duration?: number;
  dur?: number;
}
interface SupadataResponse {
  content?: SupadataSegment[] | string;
  lang?: string;
}

/**
 * Transcript via Supadata. Solves YouTube's proof-of-origin blocking for us.
 * All Supadata-specific HTTP and parsing is confined here.
 */
export class SupadataTranscriptProvider implements TranscriptProvider {
  readonly name = "supadata";

  async getTranscript(videoId: string): Promise<TranscriptResult> {
    const env = getServerEnv();
    if (!env.SUPADATA_API_KEY) {
      throw new ProviderUnavailableError(
        "Transcripts need a Supadata API key. Add SUPADATA_API_KEY to your .env.",
        "supadata",
      );
    }

    return withProviderLogging(
      { provider: "supadata", operation: "getTranscript" },
      async () => {
        const url = new URL(env.SUPADATA_API_URL);
        url.searchParams.set("url", watchUrl(videoId));
        url.searchParams.set("lang", "en");

        let res: Response;
        try {
          res = await fetch(url, {
            headers: { "x-api-key": env.SUPADATA_API_KEY!, Accept: "application/json" },
            cache: "no-store",
          });
        } catch (err) {
          throw new NetworkError("Couldn't reach the transcript service.", "supadata", { cause: err });
        }

        if (res.status === 401 || res.status === 403) {
          throw new AuthenticationError("The transcript service rejected the API key.", "supadata");
        }
        if (res.status === 404) {
          throw new TranscriptUnavailableError("This video doesn't have a transcript available.", "supadata");
        }
        if (res.status === 429) {
          throw new RateLimitError("The transcript service is rate-limited. Try again shortly.", "supadata");
        }
        if (!res.ok) {
          throw new NetworkError("The transcript service errored.", "supadata");
        }

        const data = (await res.json().catch(() => null)) as SupadataResponse | null;
        const segments = parseSegments(data);
        if (segments.length === 0) {
          throw new TranscriptUnavailableError("No transcript was returned for this video.", "supadata");
        }
        return { segments, language: data?.lang ?? "en" };
      },
    );
  }

  async hasTranscript(videoId: string): Promise<boolean> {
    try {
      const { segments } = await this.getTranscript(videoId);
      return segments.length > 0;
    } catch (err) {
      if (err instanceof TranscriptUnavailableError) return false;
      throw err;
    }
  }
}

function parseSegments(data: SupadataResponse | null): TranscriptSegment[] {
  if (!data?.content) return [];
  if (typeof data.content === "string") {
    const text = data.content.trim();
    return text ? [{ startSec: 0, endSec: 0, text }] : [];
  }
  const out: TranscriptSegment[] = [];
  for (const seg of data.content) {
    const text = (seg.text ?? "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const offsetMs = seg.offset ?? seg.start ?? 0;
    const durMs = seg.duration ?? seg.dur ?? 0;
    out.push({ startSec: offsetMs / 1000, endSec: (offsetMs + durMs) / 1000, text });
  }
  return out;
}
