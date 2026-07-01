import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import { getVideoRepository } from "@/core/container";
import { toTranscriptDTO } from "@/core/mappers/video-mapper";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

/** GET /api/videos/:id/transcript — fetch a video's saved transcript. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await getOwnedVideo(id, user.id);

    const segments = await getVideoRepository().getTranscript(id);
    if (!segments) {
      throw new InvalidInputError(
        "No transcript has been saved for this video yet.",
        "NO_CAPTIONS",
      );
    }
    return NextResponse.json({ lines: toTranscriptDTO(segments) });
  } catch (err) {
    return errorResponse(err);
  }
}
