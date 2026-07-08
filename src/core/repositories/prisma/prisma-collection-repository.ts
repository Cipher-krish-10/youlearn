import "server-only";
import { prisma } from "@/core/providers/database/prisma-client";
import type {
  CollectionRepository,
  NewCollection,
} from "@/core/interfaces/repositories";
import type { CollectionEntity } from "@/core/types/entities";

/** Prisma CollectionRepository backed by the `collections` table. */
export class PrismaCollectionRepository implements CollectionRepository {
  async create(input: NewCollection): Promise<CollectionEntity> {
    const c = await prisma.collection.create({
      data: {
        userId: input.userId,
        name: input.name,
        description: input.description ?? null,
      },
    });
    return {
      id: c.id,
      userId: c.userId,
      name: c.name,
      description: c.description,
      videoCount: 0,
      createdAt: c.createdAt,
    };
  }

  async listByUser(userId: string): Promise<CollectionEntity[]> {
    const rows = await prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { videos: true } } },
    });
    return rows.map((c) => ({
      id: c.id,
      userId: c.userId,
      name: c.name,
      description: c.description,
      videoCount: c._count.videos,
      createdAt: c.createdAt,
    }));
  }

  async getById(id: string, userId: string): Promise<CollectionEntity | null> {
    const c = await prisma.collection.findFirst({
      where: { id, userId },
      include: { _count: { select: { videos: true } } },
    });
    if (!c) return null;
    return {
      id: c.id,
      userId: c.userId,
      name: c.name,
      description: c.description,
      videoCount: c._count.videos,
      createdAt: c.createdAt,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.collection.deleteMany({ where: { id, userId } });
  }

  async addVideo(collectionId: string, videoId: string): Promise<void> {
    await prisma.collectionVideo.upsert({
      where: { collectionId_videoId: { collectionId, videoId } },
      create: { collectionId, videoId },
      update: {},
    });
  }

  async removeVideo(collectionId: string, videoId: string): Promise<void> {
    await prisma.collectionVideo.deleteMany({
      where: { collectionId, videoId },
    });
  }

  async listVideoIds(collectionId: string): Promise<string[]> {
    const rows = await prisma.collectionVideo.findMany({
      where: { collectionId },
      orderBy: { addedAt: "desc" },
      select: { videoId: true },
    });
    return rows.map((r) => r.videoId);
  }
}
