export type VideoStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";
export type TranscriptStatus = "ready" | "unavailable";

export interface VideoEntity {
  id: string;
  userId: string | null;
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
  createdAt: Date;
}

export interface NewVideo {
  userId: string;
  youtubeId: string;
  url: string;
  title: string;
  channelTitle: string | null;
  thumbnailUrl: string | null;
}

export interface ChatMessageEntity {
  id: string;
  videoId: string;
  role: "user" | "assistant";
  content: string;
  citations?: { startSec: number; text: string }[];
  createdAt: Date;
}

export interface UserEntity {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}
