import type { TranscriptProvider } from "@/core/interfaces/transcript-provider";
import type { TranscriptResult } from "@/core/types/transcript";
import { NotImplementedError } from "@/core/errors/provider-errors";

/**
 * Stub. A real implementation would download audio (yt-dlp/ffmpeg) and
 * transcribe with Whisper — useful for videos that have no captions at all.
 */
export class WhisperTranscriptProvider implements TranscriptProvider {
  readonly name = "whisper";

  getTranscript(_videoId: string): Promise<TranscriptResult> {
    throw new NotImplementedError("whisper", "getTranscript");
  }

  hasTranscript(_videoId: string): Promise<boolean> {
    throw new NotImplementedError("whisper", "hasTranscript");
  }
}
