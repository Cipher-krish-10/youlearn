import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { ensureUserRow, getCollectionRepository } from "@/core/container";
import { toCollectionDTO } from "@/core/mappers/library-mappers";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

const createSchema = z.object({
  name: z.string().trim().min(1, "Give it a name.").max(80),
  description: z.string().trim().max(200).optional().nullable(),
});

/** GET /api/collections — the user's collections. */
export async function GET() {
  try {
    const user = await requireUser();
    const collections = await getCollectionRepository().listByUser(user.id);
    return NextResponse.json({ collections: collections.map(toCollectionDTO) });
  } catch (err) {
    return errorResponse(err);
  }
}

/** POST /api/collections — create a collection. */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const parsed = createSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      throw new InvalidInputError(
        parsed.error.issues[0]?.message ?? "Invalid collection.",
      );
    }

    await ensureUserRow(user);
    const collection = await getCollectionRepository().create({
      userId: user.id,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    });
    return NextResponse.json(
      { collection: toCollectionDTO(collection) },
      { status: 201 },
    );
  } catch (err) {
    return errorResponse(err);
  }
}
