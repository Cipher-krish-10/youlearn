import { parseJson } from "@/lib/api/parse-json";
import { ApiError } from "@/features/ingestion/types";
import type { NoteDTO } from "@/features/notes/types";

const toError = (code: string, message: string, status: number) =>
  new ApiError(code as ApiError["code"], message, status);

export async function listNotesRequest(): Promise<NoteDTO[]> {
  const res = await fetch("/api/notes");
  return (await parseJson<{ notes: NoteDTO[] }>(res, toError)).notes;
}

export async function createNoteRequest(input: {
  content: string;
  tags: string[];
  videoId?: string | null;
  timestampSec?: number | null;
}): Promise<NoteDTO> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return (await parseJson<{ note: NoteDTO }>(res, toError)).note;
}

export async function deleteNoteRequest(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
  await parseJson(res, toError);
}
