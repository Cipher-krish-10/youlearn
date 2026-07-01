import "server-only";

type Level = "debug" | "info" | "warn" | "error";

interface LogFields {
  provider?: string;
  operation?: string;
  latencyMs?: number;
  success?: boolean;
  retries?: number;
  errorName?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

/**
 * Minimal structured logger. Emits one JSON line per event so logs are
 * queryable in any aggregator. It only ever receives metadata — never request
 * payloads, prompts, or API keys — so there's nothing sensitive to redact.
 */
function emit(level: Level, message: string, fields: LogFields = {}) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    message,
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (m: string, f?: LogFields) => emit("debug", m, f),
  info: (m: string, f?: LogFields) => emit("info", m, f),
  warn: (m: string, f?: LogFields) => emit("warn", m, f),
  error: (m: string, f?: LogFields) => emit("error", m, f),
};

/**
 * Wrap a provider call to record provider, operation, latency, and outcome.
 * Re-throws so error handling is unchanged — this is pure observability.
 */
export async function withProviderLogging<T>(
  meta: { provider: string; operation: string; retries?: number },
  fn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    logger.info("provider.call", {
      ...meta,
      latencyMs: Math.round(performance.now() - start),
      success: true,
    });
    return result;
  } catch (err) {
    logger.warn("provider.call", {
      ...meta,
      latencyMs: Math.round(performance.now() - start),
      success: false,
      errorName: err instanceof Error ? err.name : "Unknown",
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
