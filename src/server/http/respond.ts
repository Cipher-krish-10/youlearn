import "server-only";
import { NextResponse } from "next/server";
import { toErrorEnvelope } from "@/core/errors/provider-errors";
import { logger } from "@/core/logging/logger";

/**
 * Single place where any thrown value becomes an HTTP error response. Converts
 * provider/domain errors to the stable `{ error: { code, message } }` envelope
 * so the UI never sees a raw SDK error.
 */
export function errorResponse(err: unknown) {
  const { code, message, status } = toErrorEnvelope(err);
  if (status >= 500) {
    logger.error("api.unhandled", {
      errorName: err instanceof Error ? err.name : "Unknown",
      errorMessage: err instanceof Error ? err.message : String(err),
    });
  }
  return NextResponse.json(
    { error: { code, message } },
    {
      status,
      // Fixed one-minute windows, so a minute is always a safe retry hint.
      headers: status === 429 ? { "Retry-After": "60" } : undefined,
    },
  );
}
