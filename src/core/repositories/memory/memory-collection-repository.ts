import "server-only";
import type {
  CollectionRepository,
  NewCollection,
} from "@/core/interfaces/repositories";
import type { CollectionEntity } from "@/core/types/entities";

/** In-memory CollectionRepository. Held as a singleton by the factory. */
export class MemoryCollectionRepository implements CollectionRepository {
  private collections = new Map<string, CollectionEntity>();
  private members = new Map<string, Set<string>>(); // collectionId → videoIds

  private withCount(c: CollectionEntity): CollectionEntity {
    return { ...c, videoCount: this.members.get(c.id)?.size ?? 0 };
  }

  async create(input: NewCollection): Promise<CollectionEntity> {
    const collection: CollectionEntity = {
      id: crypto.randomUUID(),
      userId: input.userId,
      name: input.name,
      description: input.description ?? null,
      videoCount: 0,
      createdAt: new Date(),
    };
    this.collections.set(collection.id, collection);
    this.members.set(collection.id, new Set());
    return collection;
  }

  async listByUser(userId: string): Promise<CollectionEntity[]> {
    return [...this.collections.values()]
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((c) => this.withCount(c));
  }

  async getById(id: string, userId: string): Promise<CollectionEntity | null> {
    const c = this.collections.get(id);
    return c && c.userId === userId ? this.withCount(c) : null;
  }

  async delete(id: string, userId: string): Promise<void> {
    const c = this.collections.get(id);
    if (c && c.userId === userId) {
      this.collections.delete(id);
      this.members.delete(id);
    }
  }

  async addVideo(collectionId: string, videoId: string): Promise<void> {
    (this.members.get(collectionId) ?? new Set()).add(videoId);
    if (!this.members.has(collectionId))
      this.members.set(collectionId, new Set([videoId]));
    else this.members.get(collectionId)!.add(videoId);
  }

  async removeVideo(collectionId: string, videoId: string): Promise<void> {
    this.members.get(collectionId)?.delete(videoId);
  }

  async listVideoIds(collectionId: string): Promise<string[]> {
    return [...(this.members.get(collectionId) ?? [])];
  }
}
