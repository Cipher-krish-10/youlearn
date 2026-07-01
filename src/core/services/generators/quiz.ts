import { z } from "zod";
import type { QuizData } from "@/core/types/ai";
import {
  BaseGenerator,
  transcriptContext,
  type GenerationInput,
} from "@/core/services/generators/base";

const schema = z.object({
  questions: z
    .array(
      z.object({
        type: z.enum(["multiple_choice", "true_false", "short_answer"]),
        prompt: z.string().min(1),
        options: z.array(z.string()),
        answerIndex: z.number().int().min(-1),
        answer: z.string().min(1),
        explanation: z.string().min(1),
      }),
    )
    .min(3)
    .max(10),
}) satisfies z.ZodType<QuizData>;

export class QuizGenerator extends BaseGenerator<"quiz"> {
  readonly kind = "quiz" as const;
  protected readonly schema = schema;
  protected maxOutputTokens = 2200;

  protected buildPrompt(input: GenerationInput) {
    return {
      system:
        "Write a quiz that checks understanding of the transcript. Produce 5 questions mixing types. Rules per question:\n" +
        '- multiple_choice: 4 plausible "options", "answerIndex" (0-3) of the correct one, "answer" equal to that option.\n' +
        '- true_false: "options" = ["True","False"], "answerIndex" 0 or 1, "answer" matching.\n' +
        '- short_answer: "options" = [], "answerIndex" = -1, "answer" = the expected concise answer.\n' +
        'Every question needs a one-sentence "explanation". Ground everything in the transcript.\n' +
        'Respond as JSON: { "questions": [{ "type", "prompt", "options", "answerIndex", "answer", "explanation" }] }.',
      user: transcriptContext(input),
    };
  }
}
