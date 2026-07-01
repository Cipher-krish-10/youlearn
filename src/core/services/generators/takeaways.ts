import { z } from "zod";
import type { TakeawaysData } from "@/core/types/ai";
import {
  BaseGenerator,
  transcriptContext,
  type GenerationInput,
} from "@/core/services/generators/base";

const schema = z.object({
  items: z.array(z.string().min(1)).min(3).max(8),
}) satisfies z.ZodType<TakeawaysData>;

export class TakeawaysGenerator extends BaseGenerator<"takeaways"> {
  readonly kind = "takeaways" as const;
  protected readonly schema = schema;

  protected buildPrompt(input: GenerationInput) {
    return {
      system:
        "Extract the key takeaways from the transcript: 4-6 standalone, memorable points a learner should walk away with. " +
        "Each should be one clear sentence, specific to the content (not generic). " +
        'Respond as JSON: { "items": string[] }.',
      user: transcriptContext(input),
    };
  }
}
