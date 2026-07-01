import "server-only";
import { prisma } from "@/core/providers/database/prisma-client";
import type { UserRepository } from "@/core/interfaces/repositories";
import type { UserEntity } from "@/core/types/entities";

/** Prisma UserRepository backed by the `users` table. */
export class PrismaUserRepository implements UserRepository {
  async getById(id: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async upsert(user: Omit<UserEntity, "createdAt">): Promise<UserEntity> {
    return prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      update: { email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    });
  }
}
