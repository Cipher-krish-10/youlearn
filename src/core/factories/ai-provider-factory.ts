import "server-only";
import type { AIProvider } from "@/core/interfaces/ai-provider";
import { providerConfig } from "@/core/config/providers";
import { OpenAIProvider } from "@/core/providers/ai/openai/openai-provider";
import { AnthropicProvider } from "@/core/providers/ai/anthropic-provider";
import { GeminiProvider } from "@/core/providers/ai/gemini-provider";
import { GroqProvider } from "@/core/providers/ai/groq-provider";

let cached: { key: string; provider: AIProvider } | null = null;

/** Returns the AIProvider selected by AI_PROVIDER. */
export function getAIProvider(): AIProvider {
  const key = providerConfig().ai;
  if (cached?.key === key) return cached.provider;
  const provider = build(key);
  cached = { key, provider };
  return provider;
}

function build(key: ReturnType<typeof providerConfig>["ai"]): AIProvider {
  switch (key) {
    case "openai":
      return new OpenAIProvider();
    case "anthropic":
      return new AnthropicProvider();
    case "gemini":
      return new GeminiProvider();
    case "groq":
      return new GroqProvider();
  }
}
