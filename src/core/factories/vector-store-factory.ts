import "server-only";
import type { VectorStoreProvider } from "@/core/interfaces/vector-store-provider";
import { providerConfig } from "@/core/config/providers";
import { singleton } from "@/core/lib/singleton";
import { MemoryVectorStore } from "@/core/providers/vector/memory-vector-store";
import { pgVectorStore } from "@/core/providers/vector/pgvector-store";

/** Returns the VectorStoreProvider selected by VECTOR_STORE. */
export function getVectorStore(): VectorStoreProvider {
  if (providerConfig().vectorStore === "pgvector") return pgVectorStore;
  // Memory store is stateful — held as a singleton so vectors survive requests.
  return singleton("vectorStore", () => new MemoryVectorStore());
}
