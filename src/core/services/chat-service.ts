import "server-only";
import { createHash } from "node:crypto";
import { formatTimestamp, truncate } from "@/lib/utils";
import type { AIProvider } from "@/core/interfaces/ai-provider";
import type { CacheProvider } from "@/core/interfaces/cache-provider";
import type {
  ChatRepository,
  VideoRepository,
} from "@/core/interfaces/repositories";
import { logger } from "@/core/logging/logger";
import type {
  VectorMatch,
  VectorStoreProvider,
} from "@/core/interfaces/vector-store-provider";
import type { TranscriptSegment } from "@/core/types/transcript";
import { NotFoundError, TranscriptUnavailableError } from "@/core/errors/provider-errors";
import { chunkTranscript } from "@/core/services/chunking";
import { renderTranscript } from "@/core/services/transcript-sampling";

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
const ANSWER_TTL_SEC = 24 * 60 * 60; // transcripts are immutable, answers keep.

/** Same question (modulo case/whitespace) about the same video → same key. */
function answerKey(videoId: string, message: string): string {
  const hash = createHash("sha256")
    .update(message.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
  return `chat:${videoId}:${hash}`;
}

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
    private readonly chats: ChatRepository,
    private readonly cache: CacheProvider,
  ) {}

  async answer(
    videoId: string,
    message: string,
    userId: string,
  ): Promise<ChatAnswer> {
    const key = answerKey(videoId, message);
    const cached = await this.cache.get<ChatAnswer>(key);
    logger.debug("cache.read", { operation: "chat.answer", hit: cached !== null });

    const result =
      cached ??
      (this.ai.supportsEmbeddings
        ? await this.answerWithRetrieval(videoId, message)
        : await this.answerWithFullContext(videoId, message));

    if (!cached) await this.cache.set(key, result, ANSWER_TTL_SEC);

    // Persist the exchange for the Chats history (after a successful answer).
    await this.chats.append({
      userId,
      videoId,
      role: "user",
      content: message,
    });
    await this.chats.append({
      userId,
      videoId,
      role: "assistant",
      content: result.answer,
      citations: result.citations,
    });

    return result;
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
    // Sample evenly across the whole video so the tutor can answer about later
    // sections too, not just the opening minutes.
    const context = renderTranscript(
      segments,
      MAX_CONTEXT_CHARS,
      (s) => `[${formatTimestamp(s.startSec)}] ${s.text}\n`,
    );
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
