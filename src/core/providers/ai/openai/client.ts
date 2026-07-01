import "server-only";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";

let client: OpenAI | null = null;

/** Lazily-instantiated OpenAI SDK client. Confined to this provider. */
export function openaiClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: getServerEnv().OPENAI_API_KEY });
  return client;
}

export const openaiModels = {
  get chat() {
    return getServerEnv().OPENAI_CHAT_MODEL;
  },
  get embedding() {
    return getServerEnv().OPENAI_EMBEDDING_MODEL;
  },
};

/**
 * Whether a usable key is present. The dev `.env` ships a placeholder, treated
 * as "not configured" so we raise a friendly error instead of a 401 at runtime.
 */
export function isOpenAiConfigured(): boolean {
  const key = getServerEnv().OPENAI_API_KEY;
  return key.startsWith("sk-") && !key.includes("placeholder");
}
