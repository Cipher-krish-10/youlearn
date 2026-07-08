import "server-only";
import type { ChatRepository } from "@/core/interfaces/repositories";
import type { ChatMessageEntity } from "@/core/types/entities";

/** In-memory ChatRepository for chat history. */
export class MemoryChatRepository implements ChatRepository {
  private messages: ChatMessageEntity[] = [];

  async append(
    message: Omit<ChatMessageEntity, "id" | "createdAt">,
  ): Promise<ChatMessageEntity> {
    const entity: ChatMessageEntity = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this.messages.push(entity);
    return entity;
  }

  async listByVideo(videoId: string): Promise<ChatMessageEntity[]> {
    return this.messages
      .filter((m) => m.videoId === videoId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async listByUser(userId: string, limit = 200): Promise<ChatMessageEntity[]> {
    return this.messages
      .filter((m) => m.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}
