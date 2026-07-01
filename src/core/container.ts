import "server-only";
import { getAIProvider } from "@/core/factories/ai-provider-factory";
import { getTranscriptProvider } from "@/core/factories/transcript-provider-factory";
import { getVectorStore } from "@/core/factories/vector-store-factory";
import { getRepositories } from "@/core/factories/repository-factory";
import { IngestionService } from "@/core/services/ingestion-service";
import { AiContentService } from "@/core/services/ai-content-service";
import { ChatService } from "@/core/services/chat-service";

/**
 * Composition root. Routes depend only on these factory functions — never on a
 * concrete provider, repository, or SDK. Each call assembles a service from the
 * env-selected implementations; the services themselves hold only interfaces.
 */

export function getIngestionService(): IngestionService {
  const { videos } = getRepositories();
  return new IngestionService(videos, getTranscriptProvider());
}

export function getAiContentService(): AiContentService {
  const { artifacts, videos } = getRepositories();
  return new AiContentService(getAIProvider(), artifacts, videos);
}

export function getChatService(): ChatService {
  const { videos } = getRepositories();
  return new ChatService(getAIProvider(), getVectorStore(), videos);
}

export function getVideoRepository() {
  return getRepositories().videos;
}

export function getUserRepository() {
  return getRepositories().users;
}
