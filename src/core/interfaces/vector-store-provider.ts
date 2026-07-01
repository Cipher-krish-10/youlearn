export interface VectorChunk {
  index: number;
  startSec: number;
  endSec: number;
  text: string;
  embedding: number[];
}

export interface VectorMatch {
  startSec: number;
  endSec: number;
  text: string;
  /** Cosine similarity in [0, 1]; higher is more relevant. */
  score: number;
}

/**
 * Storage + nearest-neighbour search over transcript-chunk embeddings.
 * Memory and pgvector implementations are interchangeable behind this seam.
 */
export interface VectorStoreProvider {
  readonly name: string;
  index(videoId: string, chunks: VectorChunk[]): Promise<void>;
  search(
    videoId: string,
    embedding: number[],
    k: number,
  ): Promise<VectorMatch[]>;
  delete(videoId: string): Promise<void>;
  /** Whether this video already has vectors indexed (for idempotent indexing). */
  has(videoId: string): Promise<boolean>;
}
