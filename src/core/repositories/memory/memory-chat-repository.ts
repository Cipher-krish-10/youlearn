import "server-only";
import type { ChatRepository } from "@/core/interfaces/repositories";
import type { ChatMessageEntity } from "@/core/types/entities";

/** In-memory ChatRepository for chat history. */
export class MemoryChatRepository implements ChatRepository {
  private byVideo = new Map<string, ChatMessageEntity[]>();

  async append(
    message: Omit<ChatMessageEntity, "id" | "createdAt">,
  ): Promise<ChatMessageEntity> {
    const entity: ChatMessageEntity = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    const list = this.byVideo.get(message.videoId) ?? [];
    list.push(entity);
    this.byVideo.set(message.videoId, list);
    return entity;
  }

  async listByVideo(videoId: string): Promise<ChatMessageEntity[]> {
    return this.byVideo.get(videoId) ?? [];
  }
}
