import "server-only";
import type {
  ArtifactRepository,
  ChatRepository,
  UserRepository,
  VideoRepository,
} from "@/core/interfaces/repositories";
import { providerConfig } from "@/core/config/providers";
import { singleton } from "@/core/lib/singleton";
import { MemoryVideoRepository } from "@/core/repositories/memory/memory-video-repository";
import { MemoryArtifactRepository } from "@/core/repositories/memory/memory-artifact-repository";
import { MemoryChatRepository } from "@/core/repositories/memory/memory-chat-repository";
import { MemoryUserRepository } from "@/core/repositories/memory/memory-user-repository";
import { PrismaVideoRepository } from "@/core/repositories/prisma/prisma-video-repository";
import { PrismaArtifactRepository } from "@/core/repositories/prisma/prisma-artifact-repository";
import { PrismaChatRepository } from "@/core/repositories/prisma/prisma-chat-repository";
import { PrismaUserRepository } from "@/core/repositories/prisma/prisma-user-repository";

export interface Repositories {
  videos: VideoRepository;
  artifacts: ArtifactRepository;
  chats: ChatRepository;
  users: UserRepository;
}

/** Returns the repository set selected by DATABASE_PROVIDER. */
export function getRepositories(): Repositories {
  if (providerConfig().database === "prisma") {
    // Prisma repos are stateless (the DB holds state).
    return {
      videos: new PrismaVideoRepository(),
      artifacts: new PrismaArtifactRepository(),
      chats: new PrismaChatRepository(),
      users: new PrismaUserRepository(),
    };
  }
  // Memory repos are stateful — singletons so data survives across requests.
  return {
    videos: singleton("videoRepo", () => new MemoryVideoRepository()),
    artifacts: singleton("artifactRepo", () => new MemoryArtifactRepository()),
    chats: singleton("chatRepo", () => new MemoryChatRepository()),
    users: singleton("userRepo", () => new MemoryUserRepository()),
  };
}
