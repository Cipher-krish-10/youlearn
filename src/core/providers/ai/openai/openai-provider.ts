import "server-only";
import type { AIProvider, ChatRequest } from "@/core/interfaces/ai-provider";
import type { LlmTextModel } from "@/core/interfaces/llm-text-model";
import type { GenerationInput } from "@/core/types/ai";
import { OpenAiTextModel } from "@/core/providers/ai/openai/openai-text-model";
import { openaiEmbed } from "@/core/providers/ai/openai/openai-embeddings";
import { SummaryGenerator } from "@/core/services/generators/summary";
import { TakeawaysGenerator } from "@/core/services/generators/takeaways";
import { ConceptsGenerator } from "@/core/services/generators/concepts";
import { NotesGenerator } from "@/core/services/generators/notes";
import { FlashcardsGenerator } from "@/core/services/generators/flashcards";
import { QuizGenerator } from "@/core/services/generators/quiz";

const DEFAULT_CHAT_SYSTEM =
  "You are a focused tutor for a single video. Answer using ONLY the transcript excerpts provided. " +
  "Be concise and concrete. Reference the relevant moment using its [mm:ss] timestamp. " +
  "If the excerpts don't contain the answer, say the video doesn't cover it — do not use outside knowledge.";

/**
 * OpenAI implementation of the AIProvider seam. It wires the OpenAI text model
 * into the provider-agnostic generators and exposes the eight domain methods.
 * A different provider (Gemini, Groq, …) only swaps the text model + embeddings.
 */
export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  readonly supportsEmbeddings = true;
  private readonly model: LlmTextModel = new OpenAiTextModel();

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

  chat({ question, context, system, maxOutputTokens = 500 }: ChatRequest) {
    return this.model.generateText({
      system: system ?? DEFAULT_CHAT_SYSTEM,
      user: `Question: ${question}\n\nTranscript excerpts:\n${context}`,
      maxOutputTokens,
    });
  }

  createEmbeddings(texts: string[]) {
    return openaiEmbed(texts);
  }
}
