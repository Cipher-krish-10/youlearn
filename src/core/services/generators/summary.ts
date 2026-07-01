import { z } from "zod";
import type { SummaryData } from "@/core/types/ai";
import {
  BaseGenerator,
  transcriptContext,
  type GenerationInput,
} from "@/core/services/generators/base";

const schema = z.object({
  executive: z.string().min(1),
  detailed: z.string().min(1),
}) satisfies z.ZodType<SummaryData>;

export class SummaryGenerator extends BaseGenerator<"summary"> {
  readonly kind = "summary" as const;
  protected readonly schema = schema;

  protected buildPrompt(input: GenerationInput) {
    return {
      system:
        "You are an expert educator who distills video lectures. Produce two summaries of the transcript: " +
        '"executive" — 2-3 sentences capturing the core idea for someone deciding whether to watch; ' +
        '"detailed" — a single thorough paragraph (5-8 sentences) covering the main points and how they connect. ' +
        "Be faithful to the transcript; do not invent facts. " +
        'Respond as JSON: { "executive": string, "detailed": string }.',
      user: transcriptContext(input),
    };
  }
}
