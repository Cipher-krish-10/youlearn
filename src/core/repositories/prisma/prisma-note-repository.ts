import "server-only";
import { prisma } from "@/core/providers/database/prisma-client";
import type { NewNote, NoteRepository } from "@/core/interfaces/repositories";
import type { NoteEntity } from "@/core/types/entities";

/** Prisma NoteRepository backed by the `notes` table. */
export class PrismaNoteRepository implements NoteRepository {
  async create(input: NewNote): Promise<NoteEntity> {
    const n = await prisma.note.create({
      data: {
        userId: input.userId,
        videoId: input.videoId ?? null,
        content: input.content,
        timestampSec: input.timestampSec ?? null,
        tags: input.tags,
      },
    });
    return {
      id: n.id,
      userId: n.userId,
      videoId: n.videoId,
      content: n.content,
      timestampSec: n.timestampSec,
      tags: n.tags,
      createdAt: n.createdAt,
    };
  }

  async listByUser(userId: string): Promise<NoteEntity[]> {
    const rows = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((n) => ({
      id: n.id,
      userId: n.userId,
      videoId: n.videoId,
      content: n.content,
      timestampSec: n.timestampSec,
      tags: n.tags,
      createdAt: n.createdAt,
    }));
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.note.deleteMany({ where: { id, userId } });
  }
}
