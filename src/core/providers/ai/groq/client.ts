import "server-only";
import OpenAI from "openai";
import { getServerEnv } from "@/lib/env";

let client: OpenAI | null = null;

/** Groq exposes an OpenAI-compatible API, so we reuse the OpenAI SDK with its base URL. */
export function groqClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: getServerEnv().GROQ_API_KEY ?? "",
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return client;
}

export const groqModels = {
  get chat() {
    return getServerEnv().GROQ_CHAT_MODEL;
  },
};

export function isGroqConfigured(): boolean {
  return Boolean(getServerEnv().GROQ_API_KEY);
}
