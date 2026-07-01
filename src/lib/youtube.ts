import { z } from "zod";

/**
 * Pure YouTube URL helpers — safe to import on the client and the server.
 * No network, no secrets; just parsing and validation.
 */

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extract the 11-character video id from any common YouTube URL shape, or
 * accept a bare id. Returns null when the input isn't a YouTube video.
 */
export function extractYoutubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  // Bare id
  if (YOUTUBE_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  const fromWatch = url.searchParams.get("v");
  if (
    (host === "youtube.com" || host === "m.youtube.com") &&
    fromWatch &&
    YOUTUBE_ID.test(fromWatch)
  ) {
    return fromWatch;
  }

  // youtu.be/<id>, youtube.com/embed/<id>, /shorts/<id>, /live/<id>
  const segments = url.pathname.split("/").filter(Boolean);
  if (host === "youtu.be" && segments[0] && YOUTUBE_ID.test(segments[0])) {
    return segments[0];
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const idx = segments.findIndex((s) =>
      ["embed", "shorts", "live", "v"].includes(s),
    );
    const candidate = idx >= 0 ? segments[idx + 1] : undefined;
    if (candidate && YOUTUBE_ID.test(candidate)) return candidate;
  }

  return null;
}

export function isValidYoutubeUrl(input: string): boolean {
  return extractYoutubeId(input) !== null;
}

export function watchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/** Request schema for the ingest endpoint. */
export const ingestRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Paste a YouTube link to get started.")
    .refine(isValidYoutubeUrl, "That doesn't look like a YouTube video URL."),
});

export type IngestRequest = z.infer<typeof ingestRequestSchema>;
