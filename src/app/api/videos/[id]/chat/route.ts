import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import {
  getChatRepository,
  getChatService,
  getQuotaService,
} from "@/core/container";
import { InvalidInputError } from "@/core/errors/provider-errors";
import { errorResponse } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rate-limit";

// Chat answers run an LLM call over transcript context.
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  message: z.string().trim().min(1, "Ask a question to get started.").max(1000),
});

/** GET — the saved conversation for this video, oldest first. */
export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await getOwnedVideo(id, user.id);

    const messages = (await getChatRepository().listByVideo(id)).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      citations: m.citations,
    }));
    return NextResponse.json({ messages });
  } catch (err) {
    return errorResponse(err);
  }
}

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

    await enforceRateLimit("chat", user.id);
    await getQuotaService().consume(user.id, "chat");

    const result = await getChatService().answer(id, parsed.data.message, user.id);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
