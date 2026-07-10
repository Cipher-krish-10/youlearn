import "server-only";
import { getCacheProvider } from "@/core/factories/cache-provider-factory";
import { RateLimitError } from "@/core/errors/provider-errors";
import { logger } from "@/core/logging/logger";

/** Per-minute request ceilings for the expensive routes. */
export const RATE_LIMITS = {
  ingest: 2,
  generate: 5,
  chat: 20,
} as const;

export type RateLimitScope = keyof typeof RATE_LIMITS;

/**
 * Fixed-window rate limit on the shared cache: one counter per user, scope,
 * and minute. With the memory cache the window is per-instance (best effort);
 * with Upstash it's global. Throws RateLimitError → 429 with Retry-After.
 */
export async function enforceRateLimit(
  scope: RateLimitScope,
  userId: string,
): Promise<void> {
  const minute = Math.floor(Date.now() / 60_000);
  const key = `rl:${scope}:${userId}:${minute}`;
  // TTL slightly over a minute so idle windows clean themselves up.
  const count = await getCacheProvider().increment(key, 90);

  if (count > RATE_LIMITS[scope]) {
    logger.warn("rate.limited", { operation: scope, count });
    throw new RateLimitError(
      "You're doing that a little too fast. Give it a minute and try again.",
    );
  }
}
