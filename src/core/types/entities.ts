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
  userId: string;
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

export interface NoteEntity {
  id: string;
  userId: string;
  videoId: string | null;
  content: string;
  tags: string[];
  createdAt: Date;
}

export interface CollectionEntity {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  videoCount: number;
  createdAt: Date;
}
