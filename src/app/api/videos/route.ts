import { NextResponse } from "next/server";
import { extractYoutubeId, ingestRequestSchema } from "@/lib/youtube";
import { requireUser } from "@/lib/auth/session";
import {
  ensureUserRow,
  getIngestionService,
  getQuotaService,
  getVideoRepository,
} from "@/core/container";
import { toVideoDTO } from "@/core/mappers/video-mapper";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rate-limit";

// Ingestion fetches from YouTube at request time.
export const dynamic = "force-dynamic";
// Metadata + transcript fetch can exceed serverless defaults.
export const maxDuration = 60;

/** POST /api/videos — run the ingestion pipeline for a pasted URL. */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    await enforceRateLimit("ingest", user.id);

    const json = await request.json().catch(() => null);
    const parsed = ingestRequestSchema.safeParse(json);
    if (!parsed.success) {
      throw new InvalidInputError(
        parsed.error.issues[0]?.message ?? "Invalid request.",
        "INVALID_URL",
      );
    }

    // Ensure a users row exists so the video's FK is satisfiable.
    await ensureUserRow(user);

    // Re-opening a video that's already in the library is free; only a new
    // workspace consumes quota.
    const youtubeId = extractYoutubeId(parsed.data.url);
    const existing = youtubeId
      ? await getVideoRepository().getByYoutubeId(youtubeId, user.id)
      : null;
    const isNewWorkspace = !existing || existing.status !== "READY";
    if (isNewWorkspace) {
      await getQuotaService().consume(user.id, "workspace");
    }

    let video;
    try {
      video = await getIngestionService().ingest({
        url: parsed.data.url,
        userId: user.id,
      });
    } catch (err) {
      // Ingestion failed (bad video, network, provider outage) — don't let a
      // user's monthly allowance be spent on a workspace that never happened.
      if (isNewWorkspace) await getQuotaService().release(user.id, "workspace");
      throw err;
    }
    return NextResponse.json({ video: toVideoDTO(video) }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

/** GET /api/videos — list the signed-in user's library. */
export async function GET() {
  try {
    const user = await requireUser();
    const videos = await getVideoRepository().list(user.id);
    return NextResponse.json({ videos: videos.map(toVideoDTO) });
  } catch (err) {
    return errorResponse(err);
  }
}
