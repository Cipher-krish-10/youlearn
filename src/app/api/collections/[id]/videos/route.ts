import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import { getCollectionRepository } from "@/core/container";
import { InvalidInputError, NotFoundError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

const schema = z.object({ videoId: z.string().min(1) });

/** POST /api/collections/:id/videos — add a video to a collection. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new InvalidInputError("A videoId is required.");

    // Both the collection and the video must belong to the user.
    const collection = await getCollectionRepository().getById(id, user.id);
    if (!collection) throw new NotFoundError("Collection not found.");
    await getOwnedVideo(parsed.data.videoId, user.id);

    await getCollectionRepository().addVideo(id, parsed.data.videoId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
