import "server-only";
import {
  GenerationFailedError,
  ProviderUnavailableError,
} from "@/core/errors/provider-errors";
import { withProviderLogging } from "@/core/logging/logger";
import {
  isOpenAiConfigured,
  openaiClient,
  openaiModels,
} from "@/core/providers/ai/openai/client";

/** text-embedding-3-small produces 1536-dim vectors. */
export const EMBEDDING_DIM = 1536;

/** Batch-embed texts with OpenAI, preserving input order. */
export async function openaiEmbed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  if (!isOpenAiConfigured()) {
    throw new ProviderUnavailableError(
      "Embeddings need an OpenAI API key. Add OPENAI_API_KEY to your .env.",
      "openai",
    );
  }

  return withProviderLogging(
    { provider: "openai", operation: "createEmbeddings" },
    async () => {
      try {
        const res = await openaiClient().embeddings.create({
          model: openaiModels.embedding,
          input: texts,
        });
        return res.data
          .sort((a, b) => a.index - b.index)
          .map((d) => d.embedding as number[]);
      } catch (err) {
        throw new GenerationFailedError(
          err instanceof Error ? err.message : "Embedding request failed.",
          "openai",
          { cause: err },
        );
      }
    },
  );
}
