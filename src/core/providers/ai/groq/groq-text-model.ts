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
import { groqClient, groqModels, isGroqConfigured } from "@/core/providers/ai/groq/client";

/**
 * Groq implementation of the low-level text model via its OpenAI-compatible API.
 * Same JSON-mode + retry behaviour as the OpenAI model; only the endpoint and
 * model differ, so the shared generators work unchanged.
 */
export class GroqTextModel implements LlmTextModel {
  get id() {
    return groqModels.chat;
  }

  async generateJson<T>({
    system,
    user,
    schema,
    maxOutputTokens = 2048,
    temperature = 0.3,
  }: GenerateJsonOptions<T>): Promise<T> {
    this.assertConfigured();
    const systemPrompt = `${system}\n\nReturn ONLY a single valid JSON object. No markdown, no commentary.`;

    return withProviderLogging(
      { provider: "groq", operation: "generateJson" },
      async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          let content: string;
          try {
            const res = await groqClient().chat.completions.create({
              model: groqModels.chat,
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
            throw mapGroqError(err);
          }
          try {
            return schema.parse(JSON.parse(content));
          } catch {
            // retry once, then fail below
          }
        }
        throw new GenerationFailedError(
          "The model returned an unexpected format. Please try again.",
          "groq",
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
      { provider: "groq", operation: "generateText" },
      async () => {
        try {
          const res = await groqClient().chat.completions.create({
            model: groqModels.chat,
            temperature,
            max_tokens: maxOutputTokens,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          });
          return res.choices[0]?.message?.content?.trim() ?? "";
        } catch (err) {
          throw mapGroqError(err);
        }
      },
    );
  }

  private assertConfigured() {
    if (!isGroqConfigured()) {
      throw new ProviderUnavailableError(
        "AI features need a Groq API key. Add GROQ_API_KEY to your .env.",
        "groq",
      );
    }
  }
}

function mapGroqError(err: unknown) {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401 || err.status === 403) {
      return new AuthenticationError("Your Groq API key was rejected.", "groq");
    }
    if (err.status === 429) {
      return new RateLimitError(
        "Groq is rate-limiting requests. Try again in a moment.",
        "groq",
      );
    }
  }
  return new GenerationFailedError("Couldn't reach Groq. Please try again.", "groq", {
    cause: err,
  });
}
