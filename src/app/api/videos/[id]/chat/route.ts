import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import { getChatService } from "@/core/container";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";

type Params = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  message: z.string().trim().min(1, "Ask a question to get started.").max(1000),
});

/** Ask a question about a video. RAG over the transcript answers it. */
export async function POST(req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await getOwnedVideo(id, user.id);

    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      throw new InvalidInputError(
        parsed.error.issues[0]?.message ?? "Invalid request.",
      );
    }

    const result = await getChatService().answer(id, parsed.data.message);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
