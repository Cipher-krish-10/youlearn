/**
 * Shared AI artifact contracts. Plain serializable shapes used by the API
 * routes, the generator services, and the client hooks alike.
 */
import { HttpError } from "@/lib/api/http-error";

export interface SummaryData {
  executive: string;
  detailed: string;
}

export interface TakeawaysData {
  items: string[];
}

export interface ConceptsData {
  items: { term: string; definition: string }[];
}

export interface NotesData {
  sections: { heading: string; points: string[] }[];
}

export interface FlashcardsData {
  cards: { front: string; back: string }[];
}

export type QuizQuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_answer";

export interface QuizQuestion {
  type: QuizQuestionType;
  prompt: string;
  /** Choices for multiple_choice / true_false; empty for short_answer. */
  options: string[];
  /** Index into `options` for the correct choice; -1 for short_answer. */
  answerIndex: number;
  /** Canonical answer text (used by short_answer; mirrors options for choices). */
  answer: string;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

/** Maps each artifact kind to the shape it produces. */
export interface ArtifactDataMap {
  summary: SummaryData;
  takeaways: TakeawaysData;
  concepts: ConceptsData;
  notes: NotesData;
  flashcards: FlashcardsData;
  quiz: QuizData;
}

export type ArtifactKind = keyof ArtifactDataMap;

export const ARTIFACT_KINDS: ArtifactKind[] = [
  "summary",
  "takeaways",
  "concepts",
  "notes",
  "flashcards",
  "quiz",
];

export function isArtifactKind(value: string): value is ArtifactKind {
  return (ARTIFACT_KINDS as string[]).includes(value);
}

export interface Artifact<K extends ArtifactKind = ArtifactKind> {
  kind: K;
  data: ArtifactDataMap[K];
  generatedAt: string;
  model: string;
}

export type AiErrorCode =
  | "NOT_CONFIGURED"
  | "NO_TRANSCRIPT"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "GENERATION_FAILED"
  | "UNKNOWN";

export interface AiErrorBody {
  error: { code: AiErrorCode; message: string };
}

/** Thrown client-side when an AI request returns an error envelope. */
export class AiRequestError extends HttpError<AiErrorCode> {}
