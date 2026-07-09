import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getAiContentService, getVideoRepository } from "@/core/container";
import type { DeckDTO } from "@/features/flashcards/types";
import { errorResponse } from "@/server/http/respond";

/** GET /api/flashcards — one deck per video with generated flashcards. */
export async function GET() {
  try {
    const user = await requireUser();
    const videos = await getVideoRepository().list(user.id);
    const ai = getAiContentService();

    const decks: DeckDTO[] = [];
    for (const video of videos) {
      const artifact = await ai.getArtifact(video.id, "flashcards");
      if (!artifact) continue;
      decks.push({
        videoId: video.id,
        videoTitle: video.title,
        thumbnailUrl: video.thumbnailUrl,
        cardCount: artifact.data.cards.length,
        generatedAt: artifact.generatedAt,
      });
    }

    return NextResponse.json({ decks });
  } catch (err) {
    return errorResponse(err);
  }
}
