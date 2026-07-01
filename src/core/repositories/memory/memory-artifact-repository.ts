import "server-only";
import type { ArtifactRepository } from "@/core/interfaces/repositories";
import type { Artifact, ArtifactKind } from "@/core/types/ai";

/** In-memory ArtifactRepository. Stateful — held as a singleton by the factory. */
export class MemoryArtifactRepository implements ArtifactRepository {
  private cache = new Map<string, Artifact>();

  private key(videoId: string, kind: ArtifactKind) {
    return `${videoId}:${kind}`;
  }

  async get<K extends ArtifactKind>(
    videoId: string,
    kind: K,
  ): Promise<Artifact<K> | null> {
    return (this.cache.get(this.key(videoId, kind)) as Artifact<K>) ?? null;
  }

  async save<K extends ArtifactKind>(
    videoId: string,
    artifact: Artifact<K>,
  ): Promise<void> {
    this.cache.set(this.key(videoId, artifact.kind), artifact);
  }
}
