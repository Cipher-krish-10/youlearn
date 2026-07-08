import { NextResponse } from "next/server";
import { ingestRequestSchema } from "@/lib/youtube";
import { requireUser } from "@/lib/auth/session";
import {
  ensureUserRow,
  getIngestionService,
  getVideoRepository,
} from "@/core/container";
import { toVideoDTO } from "@/core/mappers/video-mapper";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

// Ingestion fetches from YouTube at request time.
export const dynamic = "force-dynamic";
// Metadata + transcript fetch can exceed serverless defaults.
export const maxDuration = 60;

/** POST /api/videos — run the ingestion pipeline for a pasted URL. */
export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const json = await request.json().catch(() => null);
    const parsed = ingestRequestSchema.safeParse(json);
    if (!parsed.success) {
      throw new InvalidInputError(
        parsed.error.issues[0]?.message ?? "Invalid request.",
      );
    }

    // Ensure a users row exists so the video's FK is satisfiable.
    await ensureUserRow(user);

    const video = await getIngestionService().ingest({
      url: parsed.data.url,
      userId: user.id,
    });
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
