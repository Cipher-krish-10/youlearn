import "server-only";
import type { AIProvider } from "@/core/interfaces/ai-provider";
import type { CacheProvider } from "@/core/interfaces/cache-provider";
import type {
  ArtifactRepository,
  VideoRepository,
} from "@/core/interfaces/repositories";
import type {
  Artifact,
  ArtifactDataMap,
  ArtifactKind,
  GenerationInput,
} from "@/core/types/ai";
import type { TranscriptSegment } from "@/core/types/transcript";
import { NotFoundError, TranscriptUnavailableError } from "@/core/errors/provider-errors";
import { logger } from "@/core/logging/logger";

const MAX_TRANSCRIPT_CHARS = 14_000;
const ARTIFACT_TTL_SEC = 60 * 60; // Postgres is the source of truth; 1h hot copy.

const artifactKey = (kind: ArtifactKind, videoId: string) =>
  `${kind}:${videoId}`;

function buildTranscriptText(segments: TranscriptSegment[]): string {
  const full = segments.map((s) => s.text).join(" ");
  return full.length <= MAX_TRANSCRIPT_CHARS
    ? full
    : `${full.slice(0, MAX_TRANSCRIPT_CHARS)}…`;
}

/**
 * Generates and caches AI artifacts. Dispatches to the AIProvider's domain
 * methods — it has no idea which model is behind them. Swapping AI_PROVIDER
 * changes nothing here. Reads go cache → Postgres; writes go Postgres → cache.
 */
export class AiContentService {
  constructor(
    private readonly ai: AIProvider,
    private readonly artifacts: ArtifactRepository,
    private readonly videos: VideoRepository,
    private readonly cache: CacheProvider,
  ) {}

  async getArtifact<K extends ArtifactKind>(
    videoId: string,
    kind: K,
  ): Promise<Artifact<K> | null> {
    const key = artifactKey(kind, videoId);
    const hot = await this.cache.get<Artifact<K>>(key);
    logger.debug("cache.read", { operation: key, hit: hot !== null });
    if (hot) return hot;

    const stored = await this.artifacts.get(videoId, kind);
    if (stored) await this.cache.set(key, stored, ARTIFACT_TTL_SEC);
    return stored;
  }

  async generate<K extends ArtifactKind>(
    videoId: string,
    kind: K,
    { force = false }: { force?: boolean } = {},
  ): Promise<Artifact<K>> {
    if (!force) {
      const cached = await this.getArtifact(videoId, kind);
      if (cached) return cached;
    }

    const video = await this.videos.get(videoId);
    if (!video) throw new NotFoundError("That video isn't in your library.");

    const segments = await this.videos.getTranscript(videoId);
    if (video.transcriptStatus !== "ready" || !segments?.length) {
      throw new TranscriptUnavailableError(
        "This video needs a transcript before AI features can run.",
      );
    }

    const input: GenerationInput = {
      title: video.title,
      channel: video.channelTitle,
      transcriptText: buildTranscriptText(segments),
    };

    const startedAt = Date.now();
    const data = (await this.run(kind, input)) as ArtifactDataMap[K];
    logger.info("ai.generate", {
      provider: this.ai.name,
      operation: kind,
      latencyMs: Date.now() - startedAt,
    });

    const artifact: Artifact<K> = {
      kind,
      data,
      generatedAt: new Date().toISOString(),
      model: this.ai.name,
    };
    await this.artifacts.save(videoId, artifact);
    await this.cache.set(artifactKey(kind, videoId), artifact, ARTIFACT_TTL_SEC);
    return artifact;
  }

  private run(kind: ArtifactKind, input: GenerationInput) {
    switch (kind) {
      case "summary":
        return this.ai.generateSummary(input);
      case "takeaways":
        return this.ai.generateKeyTakeaways(input);
      case "concepts":
        return this.ai.generateConcepts(input);
      case "notes":
        return this.ai.generateNotes(input);
      case "flashcards":
        return this.ai.generateFlashcards(input);
      case "quiz":
        return this.ai.generateQuiz(input);
    }
  }
}
