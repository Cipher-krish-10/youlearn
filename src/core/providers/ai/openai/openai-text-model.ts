import "server-only";
import OpenAI from "openai";
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
  isOpenAiConfigured,
  openaiClient,
  openaiModels,
} from "@/core/providers/ai/openai/client";

/**
 * OpenAI implementation of the low-level text model. Uses JSON mode, validates
 * against the caller's zod schema, retries once on malformed JSON, and maps SDK
 * failures to the shared provider error types.
 */
export class OpenAiTextModel implements LlmTextModel {
  get id() {
    return openaiModels.chat;
  }

  async generateJson<T>({
    system,
    user,
    schema,
    maxOutputTokens = 1600,
    temperature = 0.3,
  }: GenerateJsonOptions<T>): Promise<T> {
    this.assertConfigured();
    const systemPrompt = `${system}\n\nReturn ONLY a single valid JSON object. No markdown, no commentary.`;

    return withProviderLogging(
      { provider: "openai", operation: "generateJson" },
      async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          let content: string;
          try {
            const res = await openaiClient().chat.completions.create({
              model: openaiModels.chat,
              temperature,
              max_tokens: maxOutputTokens,
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: user },
                ...(attempt > 0
                  ? [
                      {
                        role: "system" as const,
                        content:
                          "Your previous reply was not valid JSON matching the required shape. Reply again with only the corrected JSON object.",
                      },
                    ]
                  : []),
              ],
            });
            content = res.choices[0]?.message?.content ?? "";
          } catch (err) {
            throw mapOpenAiError(err);
          }

          try {
            return schema.parse(JSON.parse(content));
          } catch {
            // retry once, then fail below
          }
        }
        throw new GenerationFailedError(
          "The model returned an unexpected format. Please try again.",
          "openai",
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
      { provider: "openai", operation: "generateText" },
      async () => {
        try {
          const res = await openaiClient().chat.completions.create({
            model: openaiModels.chat,
            temperature,
            max_tokens: maxOutputTokens,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          });
          return res.choices[0]?.message?.content?.trim() ?? "";
        } catch (err) {
          throw mapOpenAiError(err);
        }
      },
    );
  }

  private assertConfigured() {
    if (!isOpenAiConfigured()) {
      throw new ProviderUnavailableError(
        "AI features need an OpenAI API key. Add OPENAI_API_KEY to your .env.",
        "openai",
      );
    }
  }
}

function mapOpenAiError(err: unknown) {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401 || err.status === 403) {
      return new AuthenticationError(
        "Your OpenAI API key was rejected. Check OPENAI_API_KEY.",
        "openai",
      );
    }
    if (err.status === 429) {
      return new RateLimitError(
        "OpenAI is rate-limiting requests. Try again in a moment.",
        "openai",
      );
    }
  }
  return new GenerationFailedError(
    "Couldn't reach the model. Please try again.",
    "openai",
    { cause: err },
  );
}
