import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getCollectionRepository, getVideoRepository } from "@/core/container";
import { toCollectionDTO } from "@/core/mappers/library-mappers";
import { toVideoDTO } from "@/core/mappers/video-mapper";
import { NotFoundError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

/** GET /api/collections/:id — a collection and the videos in it. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const collection = await getCollectionRepository().getById(id, user.id);
    if (!collection) throw new NotFoundError("Collection not found.");

    const videoRepo = getVideoRepository();
    const ids = await getCollectionRepository().listVideoIds(id);
    const videos = (await Promise.all(ids.map((vid) => videoRepo.get(vid))))
      .filter((v) => v && v.userId === user.id)
      .map((v) => toVideoDTO(v!));

    return NextResponse.json({
      collection: toCollectionDTO(collection),
      videos,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

/** DELETE /api/collections/:id — delete a collection. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await getCollectionRepository().delete(id, user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
