/**
 * Client-side bridge between API errors and the upgrade dialog. The shared
 * response parser fires this event whenever any request returns
 * QUOTA_EXCEEDED, so individual features don't need their own handling.
 */

export const QUOTA_EXCEEDED_EVENT = "youlearn:quota-exceeded";

export function emitQuotaExceeded(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(QUOTA_EXCEEDED_EVENT, { detail: { message } }),
  );
}
