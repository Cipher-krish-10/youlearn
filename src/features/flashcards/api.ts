import { parseJson } from "@/lib/api/parse-json";
import { AiRequestError } from "@/features/ai/types";
import type { DeckDTO } from "@/features/flashcards/types";

const toError = (code: string, message: string, status: number) =>
  new AiRequestError(code as AiRequestError["code"], message, status);

export async function listDecksRequest(): Promise<DeckDTO[]> {
  const res = await fetch("/api/flashcards");
  return (await parseJson<{ decks: DeckDTO[] }>(res, toError)).decks;
}
