import "server-only";
import type {
  ArtifactRepository,
  ChatRepository,
  CollectionRepository,
  NoteRepository,
  QuotaRepository,
  UserRepository,
  VideoRepository,
} from "@/core/interfaces/repositories";
import { providerConfig } from "@/core/config/providers";
import { singleton } from "@/core/lib/singleton";
import { MemoryVideoRepository } from "@/core/repositories/memory/memory-video-repository";
import { MemoryArtifactRepository } from "@/core/repositories/memory/memory-artifact-repository";
import { MemoryChatRepository } from "@/core/repositories/memory/memory-chat-repository";
import { MemoryUserRepository } from "@/core/repositories/memory/memory-user-repository";
import { MemoryNoteRepository } from "@/core/repositories/memory/memory-note-repository";
import { MemoryCollectionRepository } from "@/core/repositories/memory/memory-collection-repository";
import { MemoryQuotaRepository } from "@/core/repositories/memory/memory-quota-repository";
import { PrismaVideoRepository } from "@/core/repositories/prisma/prisma-video-repository";
import { PrismaArtifactRepository } from "@/core/repositories/prisma/prisma-artifact-repository";
import { PrismaChatRepository } from "@/core/repositories/prisma/prisma-chat-repository";
import { PrismaUserRepository } from "@/core/repositories/prisma/prisma-user-repository";
import { PrismaNoteRepository } from "@/core/repositories/prisma/prisma-note-repository";
import { PrismaCollectionRepository } from "@/core/repositories/prisma/prisma-collection-repository";
import { PrismaQuotaRepository } from "@/core/repositories/prisma/prisma-quota-repository";

export interface Repositories {
  videos: VideoRepository;
  artifacts: ArtifactRepository;
  chats: ChatRepository;
  users: UserRepository;
  notes: NoteRepository;
  collections: CollectionRepository;
  quotas: QuotaRepository;
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
      notes: new PrismaNoteRepository(),
      collections: new PrismaCollectionRepository(),
      quotas: new PrismaQuotaRepository(),
    };
  }
  // Memory repos are stateful — singletons so data survives across requests.
  return {
    videos: singleton("videoRepo", () => new MemoryVideoRepository()),
    artifacts: singleton("artifactRepo", () => new MemoryArtifactRepository()),
    chats: singleton("chatRepo", () => new MemoryChatRepository()),
    users: singleton("userRepo", () => new MemoryUserRepository()),
    notes: singleton("noteRepo", () => new MemoryNoteRepository()),
    collections: singleton(
      "collectionRepo",
      () => new MemoryCollectionRepository(),
    ),
    quotas: singleton("quotaRepo", () => new MemoryQuotaRepository()),
  };
}
