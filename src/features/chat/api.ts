import { parseJson } from "@/lib/api/parse-json";
import { AiRequestError } from "@/features/ai/types";
import type {
  ChatAnswer,
  ChatMessage,
  ConversationDTO,
} from "@/features/chat/types";

const toError = (code: string, message: string, status: number) =>
  new AiRequestError(code as AiRequestError["code"], message, status);

export async function listConversationsRequest(): Promise<ConversationDTO[]> {
  const res = await fetch("/api/chats");
  return (await parseJson<{ conversations: ConversationDTO[] }>(res, toError))
    .conversations;
}

export async function listChatHistoryRequest(
  videoId: string,
): Promise<ChatMessage[]> {
  const res = await fetch(`/api/videos/${videoId}/chat`);
  return (await parseJson<{ messages: ChatMessage[] }>(res, toError)).messages;
}

export async function sendChatMessageRequest(
  videoId: string,
  message: string,
): Promise<ChatAnswer> {
  const res = await fetch(`/api/videos/${videoId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return parseJson<ChatAnswer>(
    res,
    toError,
    "Couldn't answer that. Please try again.",
  );
}
