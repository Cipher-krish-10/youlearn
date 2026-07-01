import { NextResponse } from "next/server";
import { isArtifactKind } from "@/features/ai/types";
import { requireUser } from "@/lib/auth/session";
import { getOwnedVideo } from "@/lib/auth/ownership";
import { getAiContentService } from "@/core/container";
import { errorResponse } from "@/server/http/respond";

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
    const artifact = await getAiContentService().generate(id, kind, { force });
    return NextResponse.json({ artifact });
  } catch (err) {
    return errorResponse(err);
  }
}
