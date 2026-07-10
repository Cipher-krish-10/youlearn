import "server-only";
import type { CacheProvider } from "@/core/interfaces/cache-provider";
import { NetworkError } from "@/core/errors/provider-errors";
import { logger } from "@/core/logging/logger";

/**
 * Upstash Redis over its REST API — no TCP client, so it works from
 * serverless without connection pooling concerns. Values are JSON-encoded.
 * Failures degrade to cache misses; a broken cache must never break requests.
 */
export class UpstashCacheProvider implements CacheProvider {
  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  private async command<T>(cmd: (string | number)[]): Promise<T | null> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmd),
    });
    if (!res.ok) {
      throw new NetworkError(`Upstash responded ${res.status}`, "upstash");
    }
    const data = (await res.json()) as { result: T };
    return data.result ?? null;
  }

  private async safe<T>(cmd: (string | number)[]): Promise<T | null> {
    try {
      return await this.command<T>(cmd);
    } catch (err) {
      logger.warn("cache.unavailable", {
        provider: "upstash",
        errorMessage: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.safe<string>(["GET", key]);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSec: number): Promise<void> {
    await this.safe(["SET", key, JSON.stringify(value), "EX", ttlSec]);
  }

  async delete(key: string): Promise<void> {
    await this.safe(["DEL", key]);
  }

  async increment(key: string, ttlSec: number): Promise<number> {
    const count = await this.safe<number>(["INCR", key]);
    // Cache down → fail open (0 = never rate limited). Availability wins.
    if (count == null) return 0;
    if (count === 1) await this.safe(["EXPIRE", key, ttlSec]);
    return count;
  }
}
