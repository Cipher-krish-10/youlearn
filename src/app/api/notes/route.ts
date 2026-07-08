import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { ensureUserRow, getNoteRepository } from "@/core/container";
import { toNoteDTO } from "@/core/mappers/library-mappers";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

const createSchema = z.object({
  content: z.string().trim().min(1, "Write something first.").max(5000),
  tags: z.array(z.string().trim().min(1)).max(10).default([]),
  videoId: z.string().optional().nullable(),
});

/** GET /api/notes — the user's notes. */
export async function GET() {
  try {
    const user = await requireUser();
    const notes = await getNoteRepository().listByUser(user.id);
    return NextResponse.json({ notes: notes.map(toNoteDTO) });
  } catch (err) {
    return errorResponse(err);
  }
}

/** POST /api/notes — create a note. */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = createSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      throw new InvalidInputError(
        parsed.error.issues[0]?.message ?? "Invalid note.",
      );
    }

    await ensureUserRow(user);
    const note = await getNoteRepository().create({
      userId: user.id,
      content: parsed.data.content,
      tags: parsed.data.tags,
      videoId: parsed.data.videoId ?? null,
    });
    return NextResponse.json({ note: toNoteDTO(note) }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
