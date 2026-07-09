"use client";

import { useQuery } from "@tanstack/react-query";
import { listDecksRequest } from "@/features/flashcards/api";

export function useDecks() {
  return useQuery({
    queryKey: ["flashcards", "decks"],
    queryFn: listDecksRequest,
  });
}
