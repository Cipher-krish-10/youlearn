"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  listChatHistoryRequest,
  sendChatMessageRequest,
} from "@/features/chat/api";

/** The saved conversation for a video, oldest first. */
export function useChatHistory(videoId: string) {
  return useQuery({
    queryKey: ["chat", "history", videoId],
    queryFn: () => listChatHistoryRequest(videoId),
  });
}

/** Sends one question to the RAG endpoint and returns the grounded answer. */
export function useSendChatMessage(videoId: string) {
  return useMutation({
    mutationFn: (message: string) => sendChatMessageRequest(videoId, message),
  });
}
