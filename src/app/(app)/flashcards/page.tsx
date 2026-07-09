import type { Metadata } from "next";
import { DecksView } from "@/features/flashcards/components/decks-view";

export const metadata: Metadata = { title: "Flashcards" };

export default function FlashcardsPage() {
  return <DecksView />;
}
