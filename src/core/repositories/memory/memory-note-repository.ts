import "server-only";
import type { NewNote, NoteRepository } from "@/core/interfaces/repositories";
import type { NoteEntity } from "@/core/types/entities";

/** In-memory NoteRepository. Held as a singleton by the factory. */
export class MemoryNoteRepository implements NoteRepository {
  private notes = new Map<string, NoteEntity>();

  async create(input: NewNote): Promise<NoteEntity> {
    const note: NoteEntity = {
      id: crypto.randomUUID(),
      userId: input.userId,
      videoId: input.videoId ?? null,
      content: input.content,
      timestampSec: input.timestampSec ?? null,
      tags: input.tags,
      createdAt: new Date(),
    };
    this.notes.set(note.id, note);
    return note;
  }

  async listByUser(userId: string): Promise<NoteEntity[]> {
    return [...this.notes.values()]
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async delete(id: string, userId: string): Promise<void> {
    const note = this.notes.get(id);
    if (note && note.userId === userId) this.notes.delete(id);
  }
}
