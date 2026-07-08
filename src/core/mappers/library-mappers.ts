import type { CollectionEntity, NoteEntity } from "@/core/types/entities";
import type { NoteDTO } from "@/features/notes/types";
import type { CollectionDTO } from "@/features/collections/types";

export function toNoteDTO(n: NoteEntity): NoteDTO {
  return {
    id: n.id,
    videoId: n.videoId,
    content: n.content,
    tags: n.tags,
    createdAt: n.createdAt.toISOString(),
  };
}

export function toCollectionDTO(c: CollectionEntity): CollectionDTO {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    videoCount: c.videoCount,
    createdAt: c.createdAt.toISOString(),
  };
}
