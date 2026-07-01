import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import { toVideoDTO } from "@/core/mappers/video-mapper";
import { errorResponse } from "@/server/http/respond";

/** GET /api/videos/:id — fetch a single video the user owns. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const video = await getOwnedVideo(id, user.id);
    return NextResponse.json({ video: toVideoDTO(video) });
  } catch (err) {
    return errorResponse(err);
  }
}
