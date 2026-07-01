import type {
  ConceptsData,
  FlashcardsData,
  GenerationInput,
  NotesData,
  QuizData,
  SummaryData,
  TakeawaysData,
} from "@/core/types/ai";

export interface ChatRequest {
  question: string;
  /** Retrieved transcript context the answer must be grounded in. */
  context: string;
  system?: string;
  maxOutputTokens?: number;
}

/**
 * The single seam for ALL model interaction. Nothing outside an implementation
 * of this interface may touch a provider SDK. Swapping providers means swapping
 * the implementation behind this interface — callers never change.
 */
export interface AIProvider {
  readonly name: string;
  /**
   * Whether this provider offers embeddings. When false (e.g. Groq), the chat
   * service uses a full-transcript context strategy instead of RAG retrieval.
   */
  readonly supportsEmbeddings: boolean;

  generateSummary(input: GenerationInput): Promise<SummaryData>;
  generateNotes(input: GenerationInput): Promise<NotesData>;
  generateKeyTakeaways(input: GenerationInput): Promise<TakeawaysData>;
  generateConcepts(input: GenerationInput): Promise<ConceptsData>;
  generateFlashcards(input: GenerationInput): Promise<FlashcardsData>;
  generateQuiz(input: GenerationInput): Promise<QuizData>;

  chat(request: ChatRequest): Promise<string>;
  createEmbeddings(texts: string[]): Promise<number[][]>;
}
