import "server-only";
import type { CacheProvider } from "@/core/interfaces/cache-provider";
import { getServerEnv } from "@/lib/env";
import { singleton } from "@/core/lib/singleton";
import { MemoryCacheProvider } from "@/core/providers/cache/memory-cache";
import { UpstashCacheProvider } from "@/core/providers/cache/upstash-cache";

/**
 * Cache selected by CACHE_PROVIDER. Upstash also activates automatically when
 * its credentials are present, so adding the two env vars is the only step.
 */
export function getCacheProvider(): CacheProvider {
  const env = getServerEnv();
  const upstashConfigured =
    !!env.UPSTASH_REDIS_REST_URL && !!env.UPSTASH_REDIS_REST_TOKEN;

  if (env.CACHE_PROVIDER === "upstash" || upstashConfigured) {
    if (!upstashConfigured) {
      throw new Error(
        "CACHE_PROVIDER=upstash requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
      );
    }
    return singleton(
      "upstashCache",
      () =>
        new UpstashCacheProvider(
          env.UPSTASH_REDIS_REST_URL!,
          env.UPSTASH_REDIS_REST_TOKEN!,
        ),
    );
  }
  return singleton("memoryCache", () => new MemoryCacheProvider());
}
