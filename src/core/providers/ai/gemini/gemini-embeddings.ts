import "server-only";
import {
  GenerationFailedError,
  ProviderUnavailableError,
} from "@/core/errors/provider-errors";
import { withProviderLogging } from "@/core/logging/logger";
import {
  GEMINI_BASE,
  geminiApiKey,
  geminiModels,
  isGeminiConfigured,
} from "@/core/providers/ai/gemini/client";

interface BatchEmbedResponse {
  embeddings?: { values?: number[] }[];
}

/** Batch-embed texts with Gemini (text-embedding-004 → 768-dim vectors). */
export async function geminiEmbed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  if (!isGeminiConfigured()) {
    throw new ProviderUnavailableError(
      "Embeddings need a Gemini API key. Add GEMINI_API_KEY to your .env.",
      "gemini",
    );
  }

  const model = geminiModels.embedding;
  const url = `${GEMINI_BASE}/models/${model}:batchEmbedContents?key=${geminiApiKey()}`;

  return withProviderLogging(
    { provider: "gemini", operation: "createEmbeddings" },
    async () => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          requests: texts.map((text) => ({
            model: `models/${model}`,
            content: { parts: [{ text }] },
          })),
        }),
      }).catch((err) => {
        throw new GenerationFailedError("Couldn't reach Gemini embeddings.", "gemini", {
          cause: err,
        });
      });

      const data = (await res.json().catch(() => null)) as BatchEmbedResponse | null;
      if (!res.ok || !data?.embeddings) {
        throw new GenerationFailedError(
          "Gemini embedding request failed.",
          "gemini",
        );
      }
      return data.embeddings.map((e) => e.values ?? []);
    },
  );
}
