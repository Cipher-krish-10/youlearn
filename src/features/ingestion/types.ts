/**
 * Transport types shared between the API routes and the client hooks.
 * These are plain serializable shapes — no server-only code reaches here.
 */
import { HttpError } from "@/lib/api/http-error";

export type VideoStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

/** Whether a usable transcript was saved for the video. */
export type TranscriptStatus = "ready" | "unavailable";

export interface VideoDTO {
  id: string;
  youtubeId: string;
  url: string;
  title: string;
  channelTitle: string | null;
  thumbnailUrl: string | null;
  durationSec: number | null;
  status: VideoStatus;
  transcriptStatus: TranscriptStatus;
  transcriptSource: "captions" | "sample" | null;
  isSample: boolean;
  createdAt: string;
}

export interface TranscriptLineDTO {
  startSec: number;
  endSec: number;
  text: string;
}

export type IngestErrorCode =
  | "INVALID_URL"
  | "VIDEO_UNAVAILABLE"
  | "NO_CAPTIONS"
  | "NETWORK"
  | "NOT_FOUND"
  | "UNKNOWN";

export interface ApiErrorBody {
  error: {
    code: IngestErrorCode;
    message: string;
  };
}

/** Thrown client-side when a fetch to our API returns an error envelope. */
export class ApiError extends HttpError<IngestErrorCode> {}
