import "server-only";

/**
 * Cache a value on `globalThis` so stateful in-memory stores survive Next's dev
 * hot-reload. Used only for implementations that MUST hold process state
 * (memory repositories, memory vector store) — stateless providers don't need it.
 */
export function singleton<T>(key: string, create: () => T): T {
  const store = globalThis as unknown as Record<string, T | undefined>;
  const scopedKey = `__youlearn_${key}`;
  store[scopedKey] ??= create();
  return store[scopedKey] as T;
}
