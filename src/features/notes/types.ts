export interface NoteDTO {
  id: string;
  videoId: string | null;
  content: string;
  /** Optional anchor into the video, in seconds. */
  timestampSec: number | null;
  tags: string[];
  createdAt: string;
}
