import { z } from "zod";
import type { FlashcardsData } from "@/core/types/ai";
import {
  BaseGenerator,
  transcriptContext,
  type GenerationInput,
} from "@/core/services/generators/base";

const schema = z.object({
  cards: z
    .array(
      z.object({
        front: z.string().min(1),
        back: z.string().min(1),
      }),
    )
    .min(4)
    .max(15),
}) satisfies z.ZodType<FlashcardsData>;

export class FlashcardsGenerator extends BaseGenerator<"flashcards"> {
  readonly kind = "flashcards" as const;
  protected readonly schema = schema;
  protected maxOutputTokens = 2000;

  protected buildPrompt(input: GenerationInput) {
    return {
      system:
        "Create study flashcards from the transcript for active recall. " +
        "Each card has a 'front' (a clear question or prompt) and a 'back' (a concise, complete answer). " +
        "Cover the most testable facts and concepts. Produce 6-12 cards. Avoid trivia and duplicates. " +
        'Respond as JSON: { "cards": [{ "front": string, "back": string }] }.',
      user: transcriptContext(input),
    };
  }
}
