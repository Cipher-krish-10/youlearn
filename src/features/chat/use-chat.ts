"use client";

import { useMutation } from "@tanstack/react-query";
import { sendChatMessageRequest } from "@/features/chat/api";

/** Sends one question to the RAG endpoint and returns the grounded answer. */
export function useSendChatMessage(videoId: string) {
  return useMutation({
    mutationFn: (message: string) => sendChatMessageRequest(videoId, message),
  });
}
