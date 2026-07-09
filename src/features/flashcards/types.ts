/** One deck on the Flashcards page — a video's generated flashcards. */
export interface DeckDTO {
  videoId: string;
  videoTitle: string;
  thumbnailUrl: string | null;
  cardCount: number;
  generatedAt: string;
}
