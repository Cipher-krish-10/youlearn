import "server-only";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/core/providers/database/prisma-client";
import type { ArtifactRepository } from "@/core/interfaces/repositories";
import type { Artifact, ArtifactKind } from "@/core/types/ai";

/** Prisma ArtifactRepository backed by the generic `ai_artifacts` table. */
export class PrismaArtifactRepository implements ArtifactRepository {
  async get<K extends ArtifactKind>(
    videoId: string,
    kind: K,
  ): Promise<Artifact<K> | null> {
    const row = await prisma.aiArtifact.findUnique({
      where: { videoId_kind: { videoId, kind } },
    });
    if (!row) return null;
    return {
      kind,
      data: row.data as unknown as Artifact<K>["data"],
      generatedAt: row.createdAt.toISOString(),
      model: row.model,
    };
  }

  async save<K extends ArtifactKind>(
    videoId: string,
    artifact: Artifact<K>,
  ): Promise<void> {
    const data = artifact.data as unknown as Prisma.InputJsonValue;
    await prisma.aiArtifact.upsert({
      where: { videoId_kind: { videoId, kind: artifact.kind } },
      create: { videoId, kind: artifact.kind, data, model: artifact.model },
      update: { data, model: artifact.model },
    });
  }
}
