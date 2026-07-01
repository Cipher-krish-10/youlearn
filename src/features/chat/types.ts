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
