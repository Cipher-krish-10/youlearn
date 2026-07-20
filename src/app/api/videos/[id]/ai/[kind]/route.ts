import { NextResponse } from "next/server";
import { isArtifactKind } from "@/features/ai/types";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import { getAiContentService, getQuotaService } from "@/core/container";
import { errorResponse } from "@/server/http/respond";
import { enforceRateLimit } from "@/server/http/rate-limit";

// AI generation over a full transcript can exceed serverless defaults.
export const maxDuration = 60;

type Params = { params: Promise<{ id: string; kind: string }> };

function badKind() {
  return NextResponse.json(
    { error: { code: "UNKNOWN", message: "Unknown artifact type." } },
    { status: 404 },
  );
}

/** Fetch a cached artifact, or 404 if it hasn't been generated yet. */
export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id, kind } = await params;
    if (!isArtifactKind(kind)) return badKind();
    await getOwnedVideo(id, user.id);

    const artifact = await getAiContentService().getArtifact(id, kind);
    if (!artifact) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Not generated yet." } },
        { status: 404 },
      );
    }
    return NextResponse.json({ artifact });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Generate (or regenerate with ?force=1) an artifact from the transcript. */
export async function POST(req: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id, kind } = await params;
    if (!isArtifactKind(kind)) return badKind();
    await getOwnedVideo(id, user.id);

    const force = new URL(req.url).searchParams.get("force") === "1";
    const service = getAiContentService();

    // Serving an existing artifact is free — only real LLM work is metered.
    if (!force) {
      const cached = await service.getArtifact(id, kind);
      if (cached) return NextResponse.json({ artifact: cached });
    }
    await enforceRateLimit("generate", user.id);
    await getQuotaService().consume(user.id, "generation");

    let artifact;
    try {
      artifact = await service.generate(id, kind, { force: true });
    } catch (err) {
      // e.g. transcript not ready, provider error — don't charge for a
      // generation that never produced anything.
      await getQuotaService().release(user.id, "generation");
      throw err;
    }
    return NextResponse.json({ artifact });
  } catch (err) {
    return errorResponse(err);
  }
}
