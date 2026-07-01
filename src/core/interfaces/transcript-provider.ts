import type { TranscriptResult } from "@/core/types/transcript";

/**
 * Source of transcripts. Implementations (Supadata, Whisper, Mock, …) hide all
 * provider specifics; callers only ever see segments or a typed error.
 */
export interface TranscriptProvider {
  readonly name: string;
  /** Fetch the transcript for a YouTube video id, or throw a typed error. */
  getTranscript(videoId: string): Promise<TranscriptResult>;
  /** Whether a transcript is obtainable without fetching the whole thing. */
  hasTranscript(videoId: string): Promise<boolean>;
}
