import type { Metadata } from "next";
import { LibraryView } from "@/features/library/components/library-view";

export const metadata: Metadata = { title: "My Videos" };

export default function LibraryPage() {
  return <LibraryView />;
}
