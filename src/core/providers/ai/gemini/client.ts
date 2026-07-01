import "server-only";
import { getServerEnv } from "@/lib/env";

export const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

export const geminiModels = {
  get chat() {
    return getServerEnv().GEMINI_CHAT_MODEL;
  },
  get embedding() {
    return getServerEnv().GEMINI_EMBEDDING_MODEL;
  },
};

export function geminiApiKey(): string | undefined {
  return getServerEnv().GEMINI_API_KEY;
}

export function isGeminiConfigured(): boolean {
  return Boolean(geminiApiKey());
}
