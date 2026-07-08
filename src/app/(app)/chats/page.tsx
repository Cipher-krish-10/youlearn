import type { Metadata } from "next";
import { ChatsView } from "@/features/chat/components/chats-view";

export const metadata: Metadata = { title: "AI Chats" };

export default function ChatsPage() {
  return <ChatsView />;
}
