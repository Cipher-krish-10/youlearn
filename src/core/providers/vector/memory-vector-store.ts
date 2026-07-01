import "server-only";
import type {
  VectorChunk,
  VectorMatch,
  VectorStoreProvider,
} from "@/core/interfaces/vector-store-provider";

function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i]! * b[i]!;
  return sum;
}
function norm(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

/**
 * In-memory cosine search. Vectors are pre-normalized on index, so each search
 * is one dot product per chunk — fast for per-video chunk counts. Stateful, so
 * it's held as a singleton (see the factory).
 */
export class MemoryVectorStore implements VectorStoreProvider {
  readonly name = "memory";
  private byVideo = new Map<string, (VectorChunk & { unit: number[] })[]>();

  async has(videoId: string): Promise<boolean> {
    return (this.byVideo.get(videoId)?.length ?? 0) > 0;
  }

  async index(videoId: string, chunks: VectorChunk[]): Promise<void> {
    this.byVideo.set(
      videoId,
      chunks.map((c) => {
        const n = norm(c.embedding) || 1;
        return { ...c, unit: c.embedding.map((x) => x / n) };
      }),
    );
  }

  async search(
    videoId: string,
    embedding: number[],
    k: number,
  ): Promise<VectorMatch[]> {
    const chunks = this.byVideo.get(videoId);
    if (!chunks?.length) return [];
    const qn = norm(embedding) || 1;
    const q = embedding.map((x) => x / qn);

    return chunks
      .map((c) => ({
        startSec: c.startSec,
        endSec: c.endSec,
        text: c.text,
        score: dot(c.unit, q),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  async delete(videoId: string): Promise<void> {
    this.byVideo.delete(videoId);
  }
}
