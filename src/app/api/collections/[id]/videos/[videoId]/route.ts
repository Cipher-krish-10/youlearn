import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getCollectionRepository } from "@/core/container";
import { NotFoundError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

/** DELETE /api/collections/:id/videos/:videoId — remove a video from a collection. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; videoId: string }> },
) {
  try {
    const user = await requireUser();
    const { id, videoId } = await params;

    const collection = await getCollectionRepository().getById(id, user.id);
    if (!collection) throw new NotFoundError("Collection not found.");

    await getCollectionRepository().removeVideo(id, videoId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
