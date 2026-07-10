/**
 * Ephemeral cache abstraction. Implementations must treat every entry as
 * disposable — the source of truth is always Postgres. Never store data here
 * that can't be regenerated.
 */
export interface CacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSec: number): Promise<void>;
  delete(key: string): Promise<void>;
  /**
   * Atomically increment a counter, creating it with `ttlSec` on first use.
   * Returns the new value. Backbone of fixed-window rate limiting.
   */
  increment(key: string, ttlSec: number): Promise<number>;
}
