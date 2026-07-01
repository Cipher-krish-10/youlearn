// Re-export the artifact contracts (defined client-side so the UI shares them)
// as the canonical server-side types too.
export type {
  SummaryData,
  NotesData,
  TakeawaysData,
  ConceptsData,
  FlashcardsData,
  QuizData,
  QuizQuestion,
  QuizQuestionType,
  ArtifactKind,
  ArtifactDataMap,
  Artifact,
} from "@/features/ai/types";

/** What every generator needs to know about the source video. */
export interface GenerationInput {
  title: string;
  channel: string | null;
  transcriptText: string;
}
