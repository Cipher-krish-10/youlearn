import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getNoteRepository } from "@/core/container";
import { errorResponse } from "@/server/http/respond";

/** DELETE /api/notes/:id — delete one of the user's notes. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await getNoteRepository().delete(id, user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
