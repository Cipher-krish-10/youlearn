"use client";

import { useQuery } from "@tanstack/react-query";
import { listConversationsRequest } from "@/features/chat/api";

export function useConversations() {
  return useQuery({
    queryKey: ["chats", "conversations"],
    queryFn: listConversationsRequest,
  });
}
