import { z } from "zod";
import type { NotesData } from "@/core/types/ai";
import {
  BaseGenerator,
  transcriptContext,
  type GenerationInput,
} from "@/core/services/generators/base";

const schema = z.object({
  sections: z
    .array(
      z.object({
        heading: z.string().min(1),
        points: z.array(z.string().min(1)).min(1).max(8),
      }),
    )
    .min(2)
    .max(8),
}) satisfies z.ZodType<NotesData>;

export class NotesGenerator extends BaseGenerator<"notes"> {
  readonly kind = "notes" as const;
  protected readonly schema = schema;
  protected maxOutputTokens = 2000;

  protected buildPrompt(input: GenerationInput) {
    return {
      system:
        "Write structured study notes from the transcript, the way a diligent student would. " +
        "Organize into 3-6 thematic sections, each with a short heading and 2-5 concise bullet points. " +
        "Capture definitions, examples, and important details; keep bullets self-contained. " +
        'Respond as JSON: { "sections": [{ "heading": string, "points": string[] }] }.',
      user: transcriptContext(input),
    };
  }
}
