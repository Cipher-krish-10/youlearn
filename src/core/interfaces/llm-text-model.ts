import type { z } from "zod";

export interface GenerateJsonOptions<T> {
  system: string;
  user: string;
  schema: z.ZodType<T>;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface GenerateTextOptions {
  system: string;
  user: string;
  maxOutputTokens?: number;
  temperature?: number;
}

/**
 * Low-level text model an AI provider uses internally. Generators depend on
 * this (not on any SDK), so the same prompt logic works for any provider that
 * can return typed JSON and free-form text.
 */
export interface LlmTextModel {
  readonly id: string;
  generateJson<T>(options: GenerateJsonOptions<T>): Promise<T>;
  generateText(options: GenerateTextOptions): Promise<string>;
}
