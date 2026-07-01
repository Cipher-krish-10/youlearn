import type { HttpError } from "@/lib/api/http-error";

interface ErrorEnvelope {
  error?: { code?: string; message?: string };
}

/**
 * Parse a JSON response, throwing a typed error built from the standard
 * `{ error: { code, message } }` envelope when the response isn't ok.
 * Shared by every feature's API client so the parse logic lives in one place.
 */
export async function parseJson<T>(
  res: Response,
  makeError: (code: string, message: string, status: number) => HttpError,
  fallbackMessage = "Request failed. Please try again.",
): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const body = data as ErrorEnvelope | null;
    throw makeError(
      body?.error?.code ?? "UNKNOWN",
      body?.error?.message ?? fallbackMessage,
      res.status,
    );
  }
  return data as T;
}
