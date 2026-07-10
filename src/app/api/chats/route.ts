import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getChatRepository, getVideoRepository } from "@/core/container";
import type { ChatMessageEntity } from "@/core/types/entities";
import type { ConversationDTO } from "@/features/chat/types";
import { errorResponse } from "@/server/http/respond";

/** GET /api/chats — the user's conversations, one row per video, newest first. */
export async function GET() {
  try {
    const user = await requireUser();
    const messages = await getChatRepository().listByUser(user.id);

    // Messages arrive newest-first, so the first seen per video is its latest.
    const byVideo = new Map<string, { last: ChatMessageEntity; count: number }>();
    for (const m of messages) {
      const g = byVideo.get(m.videoId);
      if (g) g.count += 1;
      else byVideo.set(m.videoId, { last: m, count: 1 });
    }

    // One query for all the user's videos instead of one per conversation.
    const videos = await getVideoRepository().list(user.id);
    const videoById = new Map(videos.map((v) => [v.id, v]));

    const conversations: ConversationDTO[] = [];
    for (const [videoId, g] of byVideo) {
      const video = videoById.get(videoId);
      if (!video) continue;
      conversations.push({
        videoId,
        videoTitle: video.title,
        thumbnailUrl: video.thumbnailUrl,
        lastMessage: g.last.content,
        lastRole: g.last.role,
        messageCount: g.count,
        lastAt: g.last.createdAt.toISOString(),
      });
    }

    return NextResponse.json({ conversations });
  } catch (err) {
    return errorResponse(err);
  }
}
