import "server-only";
import type { UserRepository } from "@/core/interfaces/repositories";
import type { UserEntity } from "@/core/types/entities";

/** In-memory UserRepository. Ready for when real auth lands. */
export class MemoryUserRepository implements UserRepository {
  private byId = new Map<string, UserEntity>();

  async getById(id: string): Promise<UserEntity | null> {
    return this.byId.get(id) ?? null;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    for (const u of this.byId.values()) if (u.email === email) return u;
    return null;
  }

  async upsert(user: Omit<UserEntity, "createdAt">): Promise<UserEntity> {
    const existing = this.byId.get(user.id);
    const entity: UserEntity = {
      ...user,
      createdAt: existing?.createdAt ?? new Date(),
    };
    this.byId.set(user.id, entity);
    return entity;
  }
}
