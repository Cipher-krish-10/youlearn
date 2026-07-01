import "server-only";
import type { AIProvider } from "@/core/interfaces/ai-provider";
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

const MAX_TRANSCRIPT_CHARS = 14_000;

function buildTranscriptText(segments: TranscriptSegment[]): string {
  const full = segments.map((s) => s.text).join(" ");
  return full.length <= MAX_TRANSCRIPT_CHARS
    ? full
    : `${full.slice(0, MAX_TRANSCRIPT_CHARS)}…`;
}

/**
 * Generates and caches AI artifacts. Dispatches to the AIProvider's domain
 * methods — it has no idea which model is behind them. Swapping AI_PROVIDER
 * changes nothing here.
 */
export class AiContentService {
  constructor(
    private readonly ai: AIProvider,
    private readonly artifacts: ArtifactRepository,
    private readonly videos: VideoRepository,
  ) {}

  getArtifact<K extends ArtifactKind>(videoId: string, kind: K) {
    return this.artifacts.get(videoId, kind);
  }

  async generate<K extends ArtifactKind>(
    videoId: string,
    kind: K,
    { force = false }: { force?: boolean } = {},
  ): Promise<Artifact<K>> {
    if (!force) {
      const cached = await this.artifacts.get(videoId, kind);
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

    const data = (await this.run(kind, input)) as ArtifactDataMap[K];
    const artifact: Artifact<K> = {
      kind,
      data,
      generatedAt: new Date().toISOString(),
      model: this.ai.name,
    };
    await this.artifacts.save(videoId, artifact);
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
