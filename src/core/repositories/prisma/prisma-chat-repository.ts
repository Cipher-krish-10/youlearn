import "server-only";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/core/providers/database/prisma-client";
import type { ChatRepository } from "@/core/interfaces/repositories";
import type { ChatMessageEntity } from "@/core/types/entities";

/** Prisma ChatRepository backed by the `chat_logs` table. */
export class PrismaChatRepository implements ChatRepository {
  async append(
    message: Omit<ChatMessageEntity, "id" | "createdAt">,
  ): Promise<ChatMessageEntity> {
    const row = await prisma.chatLog.create({
      data: {
        videoId: message.videoId,
        role: message.role,
        content: message.content,
        citations: (message.citations ??
          undefined) as unknown as Prisma.InputJsonValue,
      },
    });
    return {
      id: row.id,
      videoId: row.videoId,
      role: row.role as ChatMessageEntity["role"],
      content: row.content,
      citations: (row.citations as ChatMessageEntity["citations"]) ?? undefined,
      createdAt: row.createdAt,
    };
  }

  async listByVideo(videoId: string): Promise<ChatMessageEntity[]> {
    const rows = await prisma.chatLog.findMany({
      where: { videoId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      videoId: row.videoId,
      role: row.role as ChatMessageEntity["role"],
      content: row.content,
      citations: (row.citations as ChatMessageEntity["citations"]) ?? undefined,
      createdAt: row.createdAt,
    }));
  }
}
