import "server-only";
import type { AIProvider, ChatRequest } from "@/core/interfaces/ai-provider";
import type { LlmTextModel } from "@/core/interfaces/llm-text-model";
import type { GenerationInput } from "@/core/types/ai";
import { NotImplementedError } from "@/core/errors/provider-errors";
import { GroqTextModel } from "@/core/providers/ai/groq/groq-text-model";
import { SummaryGenerator } from "@/core/services/generators/summary";
import { TakeawaysGenerator } from "@/core/services/generators/takeaways";
import { ConceptsGenerator } from "@/core/services/generators/concepts";
import { NotesGenerator } from "@/core/services/generators/notes";
import { FlashcardsGenerator } from "@/core/services/generators/flashcards";
import { QuizGenerator } from "@/core/services/generators/quiz";

const DEFAULT_CHAT_SYSTEM =
  "You are a focused tutor for a single video. Answer using ONLY the transcript provided. " +
  "Be concise and concrete. Reference the relevant moment using its [mm:ss] timestamp. " +
  "If the transcript doesn't contain the answer, say the video doesn't cover it — do not use outside knowledge.";

/**
 * Groq implementation of the AIProvider seam (OpenAI-compatible chat). Reuses
 * the shared generators. Groq has no embeddings endpoint, so `supportsEmbeddings`
 * is false — the chat service then uses a full-transcript context strategy
 * (Llama 3.3 70B has a large context window), and createEmbeddings is never called.
 */
export class GroqProvider implements AIProvider {
  readonly name = "groq";
  readonly supportsEmbeddings = false;
  private readonly model: LlmTextModel = new GroqTextModel();

  private readonly generators = {
    summary: new SummaryGenerator(this.model),
    takeaways: new TakeawaysGenerator(this.model),
    concepts: new ConceptsGenerator(this.model),
    notes: new NotesGenerator(this.model),
    flashcards: new FlashcardsGenerator(this.model),
    quiz: new QuizGenerator(this.model),
  };

  generateSummary(input: GenerationInput) {
    return this.generators.summary.generate(input);
  }
  generateNotes(input: GenerationInput) {
    return this.generators.notes.generate(input);
  }
  generateKeyTakeaways(input: GenerationInput) {
    return this.generators.takeaways.generate(input);
  }
  generateConcepts(input: GenerationInput) {
    return this.generators.concepts.generate(input);
  }
  generateFlashcards(input: GenerationInput) {
    return this.generators.flashcards.generate(input);
  }
  generateQuiz(input: GenerationInput) {
    return this.generators.quiz.generate(input);
  }

  chat({ question, context, system, maxOutputTokens = 700 }: ChatRequest) {
    return this.model.generateText({
      system: system ?? DEFAULT_CHAT_SYSTEM,
      user: `Question: ${question}\n\nVideo transcript:\n${context}`,
      maxOutputTokens,
    });
  }

  createEmbeddings(_texts: string[]): Promise<number[][]> {
    throw new NotImplementedError("groq", "createEmbeddings");
  }
}
