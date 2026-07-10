import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import { getVideoRepository } from "@/core/container";
import { getCacheProvider } from "@/core/factories/cache-provider-factory";
import { toTranscriptDTO } from "@/core/mappers/video-mapper";
import type { TranscriptLineDTO } from "@/features/ingestion/types";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

// Transcripts are immutable once saved, so a long TTL is safe.
const TRANSCRIPT_TTL_SEC = 6 * 60 * 60;

/** GET /api/videos/:id/transcript — fetch a video's saved transcript. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await getOwnedVideo(id, user.id);

    const cache = getCacheProvider();
    const key = `transcript:${id}`;
    const hot = await cache.get<TranscriptLineDTO[]>(key);
    if (hot) return NextResponse.json({ lines: hot });

    const segments = await getVideoRepository().getTranscript(id);
    if (!segments) {
      throw new InvalidInputError(
        "No transcript has been saved for this video yet.",
        "NO_CAPTIONS",
      );
    }
    const lines = toTranscriptDTO(segments);
    await cache.set(key, lines, TRANSCRIPT_TTL_SEC);
    return NextResponse.json({ lines });
  } catch (err) {
    return errorResponse(err);
  }
}
