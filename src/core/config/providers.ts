import "server-only";
import { getServerEnv } from "@/lib/env";

/**
 * Single source of truth for which implementation each layer uses. Read from
 * env so swapping a provider is a config change, never a code change.
 */
export interface ProviderConfig {
  ai: "openai" | "anthropic" | "gemini" | "groq";
  transcript: "supadata" | "whisper" | "mock";
  vectorStore: "memory" | "pgvector";
  database: "memory" | "prisma";
}

export function providerConfig(): ProviderConfig {
  const env = getServerEnv();
  return {
    ai: env.AI_PROVIDER,
    transcript: env.TRANSCRIPT_PROVIDER,
    vectorStore: env.VECTOR_STORE,
    database: env.DATABASE_PROVIDER,
  };
}
