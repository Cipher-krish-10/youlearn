import { z } from "zod";
import type { ConceptsData } from "@/core/types/ai";
import {
  BaseGenerator,
  transcriptContext,
  type GenerationInput,
} from "@/core/services/generators/base";

const schema = z.object({
  items: z
    .array(
      z.object({
        term: z.string().min(1),
        definition: z.string().min(1),
      }),
    )
    .min(3)
    .max(10),
}) satisfies z.ZodType<ConceptsData>;

export class ConceptsGenerator extends BaseGenerator<"concepts"> {
  readonly kind = "concepts" as const;
  protected readonly schema = schema;

  protected buildPrompt(input: GenerationInput) {
    return {
      system:
        "Identify the important concepts, terms, or techniques the transcript introduces. " +
        "For each, give the term and a concise one-sentence definition grounded in how the video explains it. " +
        "Return 4-8 of the most important ones, ordered by significance. " +
        'Respond as JSON: { "items": [{ "term": string, "definition": string }] }.',
      user: transcriptContext(input),
    };
  }
}
