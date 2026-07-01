import "server-only";
import type { TranscriptProvider } from "@/core/interfaces/transcript-provider";
import { providerConfig } from "@/core/config/providers";
import { SupadataTranscriptProvider } from "@/core/providers/transcript/supadata-provider";
import { WhisperTranscriptProvider } from "@/core/providers/transcript/whisper-provider";
import { MockTranscriptProvider } from "@/core/providers/transcript/mock-provider";

/** Returns the TranscriptProvider selected by TRANSCRIPT_PROVIDER. */
export function getTranscriptProvider(): TranscriptProvider {
  switch (providerConfig().transcript) {
    case "whisper":
      return new WhisperTranscriptProvider();
    case "mock":
      return new MockTranscriptProvider();
    case "supadata":
    default:
      return new SupadataTranscriptProvider();
  }
}
