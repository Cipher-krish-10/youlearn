import "server-only";
import { formatTimestamp, truncate } from "@/lib/utils";
import type { AIProvider } from "@/core/interfaces/ai-provider";
import type { VideoRepository } from "@/core/interfaces/repositories";
import type {
  VectorMatch,
  VectorStoreProvider,
} from "@/core/interfaces/vector-store-provider";
import type { TranscriptSegment } from "@/core/types/transcript";
import { NotFoundError, TranscriptUnavailableError } from "@/core/errors/provider-errors";
import { chunkTranscript } from "@/core/services/chunking";

export interface ChatCitation {
  startSec: number;
  text: string;
}
export interface ChatAnswer {
  answer: string;
  citations: ChatCitation[];
}

const RETRIEVE_K = 5;
const MAX_CONTEXT_CHARS = 30_000;

const NO_MATCH_ANSWER =
  "I couldn't find anything about that in this video. Try rephrasing, or ask about a topic it covers.";

/**
 * Retrieval-Augmented Generation for "Chat with Video", with two strategies:
 *
 * - Providers with embeddings (OpenAI, Gemini) → index once, then embed the
 *   query and retrieve the most relevant chunks (true RAG, with citations).
 * - Providers without embeddings (Groq) → pass a timestamped, length-capped
 *   transcript directly as context, relying on the model's large context window.
 *
 * Either way, callers (the route) are unchanged — the strategy is chosen from
 * the provider's declared capability.
 */
export class ChatService {
  constructor(
    private readonly ai: AIProvider,
    private readonly vectors: VectorStoreProvider,
    private readonly videos: VideoRepository,
  ) {}

  async answer(videoId: string, message: string): Promise<ChatAnswer> {
    return this.ai.supportsEmbeddings
      ? this.answerWithRetrieval(videoId, message)
      : this.answerWithFullContext(videoId, message);
  }

  /** Embedding-backed retrieval path. */
  private async answerWithRetrieval(
    videoId: string,
    message: string,
  ): Promise<ChatAnswer> {
    await this.ensureIndexed(videoId);

    const [queryEmbedding] = await this.ai.createEmbeddings([message]);
    const matches = await this.vectors.search(
      videoId,
      queryEmbedding ?? [],
      RETRIEVE_K,
    );
    if (matches.length === 0) return { answer: NO_MATCH_ANSWER, citations: [] };

    const answer = await this.ai.chat({
      question: message,
      context: matches
        .map((m) => `[${formatTimestamp(m.startSec)}] ${m.text}`)
        .join("\n\n"),
    });
    return { answer, citations: toCitations(matches) };
  }

  /** No-embeddings path: feed the (capped) timestamped transcript as context. */
  private async answerWithFullContext(
    videoId: string,
    message: string,
  ): Promise<ChatAnswer> {
    const segments = await this.getReadyTranscript(videoId);
    let context = "";
    for (const s of segments) {
      const line = `[${formatTimestamp(s.startSec)}] ${s.text}\n`;
      if (context.length + line.length > MAX_CONTEXT_CHARS) break;
      context += line;
    }
    const answer = await this.ai.chat({ question: message, context });
    return { answer, citations: [] };
  }

  async ensureIndexed(videoId: string): Promise<void> {
    if (await this.vectors.has(videoId)) return;
    const segments = await this.getReadyTranscript(videoId);
    const chunks = chunkTranscript(segments);
    const embeddings = await this.ai.createEmbeddings(chunks.map((c) => c.text));
    await this.vectors.index(
      videoId,
      chunks.map((c, i) => ({ ...c, embedding: embeddings[i] ?? [] })),
    );
  }

  private async getReadyTranscript(videoId: string): Promise<TranscriptSegment[]> {
    const video = await this.videos.get(videoId);
    if (!video) throw new NotFoundError("That video isn't in your library.");

    const segments = await this.videos.getTranscript(videoId);
    if (video.transcriptStatus !== "ready" || !segments?.length) {
      throw new TranscriptUnavailableError(
        "This video needs a transcript before you can chat with it.",
      );
    }
    return segments;
  }
}

function toCitations(matches: VectorMatch[]): ChatCitation[] {
  return matches.slice(0, 3).map((m) => ({
    startSec: m.startSec,
    text: truncate(m.text, 120),
  }));
}
