import type { AIProvider, ChatRequest } from "@/core/interfaces/ai-provider";
import type { GenerationInput } from "@/core/types/ai";
import { NotImplementedError } from "@/core/errors/provider-errors";

/**
 * Base for not-yet-built AI providers. Satisfies the full AIProvider interface
 * (so the factory can return it) but every method throws a clear, typed error.
 * Implementing a real provider means subclassing and overriding these.
 */
export abstract class UnimplementedAIProvider implements AIProvider {
  abstract readonly name: string;
  readonly supportsEmbeddings = false;

  private fail(capability: string): never {
    throw new NotImplementedError(this.name, capability);
  }

  generateSummary(_input: GenerationInput): Promise<never> {
    return this.fail("generateSummary");
  }
  generateNotes(_input: GenerationInput): Promise<never> {
    return this.fail("generateNotes");
  }
  generateKeyTakeaways(_input: GenerationInput): Promise<never> {
    return this.fail("generateKeyTakeaways");
  }
  generateConcepts(_input: GenerationInput): Promise<never> {
    return this.fail("generateConcepts");
  }
  generateFlashcards(_input: GenerationInput): Promise<never> {
    return this.fail("generateFlashcards");
  }
  generateQuiz(_input: GenerationInput): Promise<never> {
    return this.fail("generateQuiz");
  }
  chat(_request: ChatRequest): Promise<never> {
    return this.fail("chat");
  }
  createEmbeddings(_texts: string[]): Promise<never> {
    return this.fail("createEmbeddings");
  }
}
