import type { z } from "zod";
import type { ArtifactDataMap, ArtifactKind, GenerationInput } from "@/core/types/ai";
import type { LlmTextModel } from "@/core/interfaces/llm-text-model";

export type { GenerationInput };

/**
 * One generator per artifact (Single Responsibility). Provider-agnostic: it
 * only knows how to turn a transcript into a prompt and validate the result.
 * The actual model call is delegated to whatever LlmTextModel it's given, so
 * the same generators work for OpenAI, Gemini, Groq, etc.
 */
export interface ArtifactGenerator<K extends ArtifactKind> {
  readonly kind: K;
  generate(input: GenerationInput): Promise<ArtifactDataMap[K]>;
}

export abstract class BaseGenerator<K extends ArtifactKind>
  implements ArtifactGenerator<K>
{
  abstract readonly kind: K;
  protected abstract readonly schema: z.ZodType<ArtifactDataMap[K]>;
  protected maxOutputTokens = 1600;

  constructor(protected readonly model: LlmTextModel) {}

  protected abstract buildPrompt(input: GenerationInput): {
    system: string;
    user: string;
  };

  async generate(input: GenerationInput): Promise<ArtifactDataMap[K]> {
    const { system, user } = this.buildPrompt(input);
    return this.model.generateJson({
      system,
      user,
      schema: this.schema,
      maxOutputTokens: this.maxOutputTokens,
    });
  }
}

/** Shared context block prepended to each generator's user prompt. */
export function transcriptContext(input: GenerationInput): string {
  return [
    `Video title: ${input.title}`,
    input.channel ? `Channel: ${input.channel}` : null,
    "",
    "Transcript:",
    input.transcriptText,
  ]
    .filter(Boolean)
    .join("\n");
}
