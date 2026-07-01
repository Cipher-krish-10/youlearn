/**
 * Centralized React Query key factory.
 * Keeps cache keys consistent and refactor-safe across the app.
 */
export const queryKeys = {
  videos: {
    all: ["videos"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["videos", "list", filters ?? {}] as const,
    detail: (videoId: string) => ["videos", "detail", videoId] as const,
    status: (videoId: string) => ["videos", "status", videoId] as const,
  },
  transcript: {
    byVideo: (videoId: string) => ["transcript", videoId] as const,
  },
  summary: {
    byVideo: (videoId: string) => ["summary", videoId] as const,
  },
  chat: {
    sessions: (videoId: string) => ["chat", "sessions", videoId] as const,
    messages: (sessionId: string) => ["chat", "messages", sessionId] as const,
  },
  flashcards: {
    byVideo: (videoId: string) => ["flashcards", videoId] as const,
  },
  quiz: {
    byVideo: (videoId: string) => ["quiz", videoId] as const,
  },
  notes: {
    all: ["notes"] as const,
    byVideo: (videoId: string) => ["notes", videoId] as const,
  },
  collections: {
    all: ["collections"] as const,
  },
  ai: {
    artifact: (videoId: string, kind: string) =>
      ["ai", videoId, kind] as const,
  },
} as const;
