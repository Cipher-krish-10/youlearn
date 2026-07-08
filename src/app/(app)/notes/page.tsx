import type { Metadata } from "next";
import { NotesView } from "@/features/notes/components/notes-view";

export const metadata: Metadata = { title: "Saved Notes" };

export default function NotesPage() {
  return <NotesView />;
}
