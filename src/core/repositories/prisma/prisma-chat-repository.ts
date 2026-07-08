import "server-only";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/core/providers/database/prisma-client";
import type { ChatRepository } from "@/core/interfaces/repositories";
import type { ChatMessageEntity } from "@/core/types/entities";

type Row = {
  id: string;
  userId: string;
  videoId: string;
  role: string;
  content: string;
  citations: unknown;
  createdAt: Date;
};

function toEntity(row: Row): ChatMessageEntity {
  return {
    id: row.id,
    userId: row.userId,
    videoId: row.videoId,
    role: row.role as ChatMessageEntity["role"],
    content: row.content,
    citations: (row.citations as ChatMessageEntity["citations"]) ?? undefined,
    createdAt: row.createdAt,
  };
}

/** Prisma ChatRepository backed by the `chat_logs` table. */
export class PrismaChatRepository implements ChatRepository {
  async append(
    message: Omit<ChatMessageEntity, "id" | "createdAt">,
  ): Promise<ChatMessageEntity> {
    const row = await prisma.chatLog.create({
      data: {
        userId: message.userId,
        videoId: message.videoId,
        role: message.role,
        content: message.content,
        citations: (message.citations ??
          undefined) as unknown as Prisma.InputJsonValue,
      },
    });
    return toEntity(row);
  }

  async listByVideo(videoId: string): Promise<ChatMessageEntity[]> {
    const rows = await prisma.chatLog.findMany({
      where: { videoId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(toEntity);
  }

  async listByUser(userId: string, limit = 200): Promise<ChatMessageEntity[]> {
    const rows = await prisma.chatLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(toEntity);
  }
}
