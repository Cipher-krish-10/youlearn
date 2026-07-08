export interface NoteDTO {
  id: string;
  videoId: string | null;
  content: string;
  tags: string[];
  createdAt: string;
}
