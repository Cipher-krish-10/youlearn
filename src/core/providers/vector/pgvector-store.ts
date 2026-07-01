import "server-only";
import { prisma } from "@/core/providers/database/prisma-client";
import type {
  VectorChunk,
  VectorMatch,
  VectorStoreProvider,
} from "@/core/interfaces/vector-store-provider";

/**
 * pgvector-backed store. Active when VECTOR_STORE=pgvector. Requires the
 * migration in `prisma/sql/pgvector.sql` (extension + embedding column + HNSW
 * cosine index). Search is a single indexed nearest-neighbour query.
 */
class PgVectorStore implements VectorStoreProvider {
  readonly name = "pgvector";

  private vec(embedding: number[]): string {
    return `[${embedding.join(",")}]`;
  }

  async has(videoId: string): Promise<boolean> {
    const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1 FROM "transcript_chunks"
        WHERE "videoId" = ${videoId} AND "embedding" IS NOT NULL
      ) AS "exists"
    `;
    return rows[0]?.exists ?? false;
  }

  async index(videoId: string, chunks: VectorChunk[]): Promise<void> {
    await prisma.$transaction([
      prisma.$executeRaw`DELETE FROM "transcript_chunks" WHERE "videoId" = ${videoId}`,
      ...chunks.map(
        (c) => prisma.$executeRaw`
          INSERT INTO "transcript_chunks"
            ("id", "videoId", "index", "startSec", "endSec", "text", "embedding", "createdAt")
          VALUES (
            ${crypto.randomUUID()}, ${videoId}, ${c.index}, ${c.startSec},
            ${c.endSec}, ${c.text}, ${this.vec(c.embedding)}::vector, now()
          )
        `,
      ),
    ]);
  }

  async search(
    videoId: string,
    embedding: number[],
    k: number,
  ): Promise<VectorMatch[]> {
    const vec = this.vec(embedding);
    return prisma.$queryRaw<VectorMatch[]>`
      SELECT "startSec", "endSec", "text",
             1 - ("embedding" <=> ${vec}::vector) AS "score"
      FROM "transcript_chunks"
      WHERE "videoId" = ${videoId} AND "embedding" IS NOT NULL
      ORDER BY "embedding" <=> ${vec}::vector
      LIMIT ${k}
    `;
  }

  async delete(videoId: string): Promise<void> {
    await prisma.$executeRaw`DELETE FROM "transcript_chunks" WHERE "videoId" = ${videoId}`;
  }
}

export const pgVectorStore: VectorStoreProvider = new PgVectorStore();
