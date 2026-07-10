import "server-only";
import type { CacheProvider } from "@/core/interfaces/cache-provider";

interface Entry {
  value: unknown;
  expiresAt: number;
}

/**
 * In-process cache for development and as the zero-config default. On
 * serverless each instance has its own map, so hit rates are low there —
 * production should use the Upstash implementation.
 */
export class MemoryCacheProvider implements CacheProvider {
  private entries = new Map<string, Entry>();

  private live(key: string): Entry | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }
    return entry;
  }

  async get<T>(key: string): Promise<T | null> {
    return (this.live(key)?.value as T) ?? null;
  }

  async set<T>(key: string, value: T, ttlSec: number): Promise<void> {
    this.entries.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }

  async increment(key: string, ttlSec: number): Promise<number> {
    const current = this.live(key);
    const next = typeof current?.value === "number" ? current.value + 1 : 1;
    this.entries.set(key, {
      value: next,
      // Fixed window: keep the original expiry when the key already exists.
      expiresAt: current?.expiresAt ?? Date.now() + ttlSec * 1000,
    });
    return next;
  }
}
