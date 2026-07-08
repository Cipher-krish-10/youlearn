export interface ChatCitation {
  startSec: number;
  text: string;
}

export interface ChatAnswer {
  answer: string;
  citations: ChatCitation[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[];
  isError?: boolean;
}

/** One row on the AI Chats page — the latest exchange per video. */
export interface ConversationDTO {
  videoId: string;
  videoTitle: string;
  thumbnailUrl: string | null;
  lastMessage: string;
  lastRole: "user" | "assistant";
  messageCount: number;
  lastAt: string;
}
