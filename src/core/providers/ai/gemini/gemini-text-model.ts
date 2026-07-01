import "server-only";
import type {
  GenerateJsonOptions,
  GenerateTextOptions,
  LlmTextModel,
} from "@/core/interfaces/llm-text-model";
import {
  AuthenticationError,
  GenerationFailedError,
  ProviderUnavailableError,
  RateLimitError,
} from "@/core/errors/provider-errors";
import { withProviderLogging } from "@/core/logging/logger";
import {
  GEMINI_BASE,
  geminiApiKey,
  geminiModels,
  isGeminiConfigured,
} from "@/core/providers/ai/gemini/client";

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { code?: number; message?: string; status?: string };
}

/**
 * Google Gemini implementation of the low-level text model, via the REST API.
 * Mirrors the OpenAI model: JSON mode for structured output, one retry on
 * malformed JSON, and SDK failures mapped to shared provider errors.
 */
export class GeminiTextModel implements LlmTextModel {
  get id() {
    return geminiModels.chat;
  }

  async generateJson<T>({
    system,
    user,
    schema,
    maxOutputTokens = 2048,
    temperature = 0.3,
  }: GenerateJsonOptions<T>): Promise<T> {
    this.assertConfigured();
    const systemText = `${system}\n\nReturn ONLY a single valid JSON object. No markdown, no commentary.`;

    return withProviderLogging(
      { provider: "gemini", operation: "generateJson" },
      async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          const text = await this.call({
            system: systemText,
            user,
            temperature,
            maxOutputTokens,
            json: true,
          });
          try {
            return schema.parse(JSON.parse(stripFence(text)));
          } catch {
            // retry once, then fail below
          }
        }
        throw new GenerationFailedError(
          "The model returned an unexpected format. Please try again.",
          "gemini",
        );
      },
    );
  }

  async generateText({
    system,
    user,
    maxOutputTokens = 700,
    temperature = 0.3,
  }: GenerateTextOptions): Promise<string> {
    this.assertConfigured();
    return withProviderLogging(
      { provider: "gemini", operation: "generateText" },
      () => this.call({ system, user, temperature, maxOutputTokens, json: false }),
    );
  }

  private async call(opts: {
    system: string;
    user: string;
    temperature: number;
    maxOutputTokens: number;
    json: boolean;
  }): Promise<string> {
    const url = `${GEMINI_BASE}/models/${geminiModels.chat}:generateContent?key=${geminiApiKey()}`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: opts.system }] },
          contents: [{ role: "user", parts: [{ text: opts.user }] }],
          generationConfig: {
            temperature: opts.temperature,
            maxOutputTokens: opts.maxOutputTokens,
            ...(opts.json ? { responseMimeType: "application/json" } : {}),
          },
        }),
      });
    } catch (err) {
      throw new GenerationFailedError("Couldn't reach Gemini.", "gemini", {
        cause: err,
      });
    }

    const data = (await res.json().catch(() => null)) as GeminiResponse | null;
    if (!res.ok) throw mapGeminiError(res.status, data);

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) {
      throw new GenerationFailedError("Gemini returned an empty response.", "gemini");
    }
    return text;
  }

  private assertConfigured() {
    if (!isGeminiConfigured()) {
      throw new ProviderUnavailableError(
        "AI features need a Gemini API key. Add GEMINI_API_KEY to your .env.",
        "gemini",
      );
    }
  }
}

/** Gemini sometimes wraps JSON in ```json fences despite the mime type. */
function stripFence(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function mapGeminiError(status: number, data: GeminiResponse | null) {
  const message = data?.error?.message ?? "";
  if (status === 400 && /api[_ ]?key/i.test(message)) {
    return new AuthenticationError("Your Gemini API key was rejected.", "gemini");
  }
  if (status === 401 || status === 403) {
    return new AuthenticationError("Your Gemini API key was rejected.", "gemini");
  }
  if (status === 429) {
    return new RateLimitError(
      "Gemini is rate-limiting requests (free tier limit). Try again shortly.",
      "gemini",
    );
  }
  return new GenerationFailedError(
    message || "Gemini request failed. Please try again.",
    "gemini",
  );
}
