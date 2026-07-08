import type { Artifact, ArtifactKind } from "@/core/types/ai";
import type { TranscriptSegment } from "@/core/types/transcript";
import type {
  ChatMessageEntity,
  CollectionEntity,
  NewVideo,
  NoteEntity,
  UserEntity,
  VideoEntity,
} from "@/core/types/entities";

/** Persistence boundary for videos and their transcripts. */
export interface VideoRepository {
  create(input: NewVideo): Promise<VideoEntity>;
  get(id: string): Promise<VideoEntity | null>;
  getByYoutubeId(youtubeId: string, userId: string): Promise<VideoEntity | null>;
  list(userId: string): Promise<VideoEntity[]>;
  update(id: string, patch: Partial<VideoEntity>): Promise<void>;
  saveTranscript(videoId: string, segments: TranscriptSegment[]): Promise<void>;
  getTranscript(videoId: string): Promise<TranscriptSegment[] | null>;
}

/** Cache of generated AI artifacts so re-opening a tab doesn't re-bill. */
export interface ArtifactRepository {
  get<K extends ArtifactKind>(
    videoId: string,
    kind: K,
  ): Promise<Artifact<K> | null>;
  save<K extends ArtifactKind>(
    videoId: string,
    artifact: Artifact<K>,
  ): Promise<void>;
}

/** Persistence for chat transcripts (history). */
export interface ChatRepository {
  append(
    message: Omit<ChatMessageEntity, "id" | "createdAt">,
  ): Promise<ChatMessageEntity>;
  listByVideo(videoId: string): Promise<ChatMessageEntity[]>;
  /** Recent messages for a user across all videos (newest first). */
  listByUser(userId: string, limit?: number): Promise<ChatMessageEntity[]>;
}

/** Persistence for users (ready for when real auth lands). */
export interface UserRepository {
  getById(id: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  upsert(user: Omit<UserEntity, "createdAt">): Promise<UserEntity>;
}

export interface NewNote {
  userId: string;
  videoId?: string | null;
  content: string;
  tags: string[];
}

/** Per-user personal notes. */
export interface NoteRepository {
  create(input: NewNote): Promise<NoteEntity>;
  listByUser(userId: string): Promise<NoteEntity[]>;
  delete(id: string, userId: string): Promise<void>;
}

export interface NewCollection {
  userId: string;
  name: string;
  description?: string | null;
}

/** Per-user collections (folders of videos). */
export interface CollectionRepository {
  create(input: NewCollection): Promise<CollectionEntity>;
  listByUser(userId: string): Promise<CollectionEntity[]>;
  getById(id: string, userId: string): Promise<CollectionEntity | null>;
  delete(id: string, userId: string): Promise<void>;
  /** Membership (caller verifies video + collection ownership first). */
  addVideo(collectionId: string, videoId: string): Promise<void>;
  removeVideo(collectionId: string, videoId: string): Promise<void>;
  listVideoIds(collectionId: string): Promise<string[]>;
}
