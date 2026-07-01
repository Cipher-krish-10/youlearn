import { parseJson } from "@/lib/api/parse-json";
import {
  ApiError,
  type TranscriptLineDTO,
  type VideoDTO,
} from "@/features/ingestion/types";

const toError = (code: string, message: string, status: number) =>
  new ApiError(code as ApiError["code"], message, status);

export async function listVideosRequest(): Promise<VideoDTO[]> {
  const res = await fetch("/api/videos");
  return (await parseJson<{ videos: VideoDTO[] }>(res, toError)).videos;
}

export async function ingestVideoRequest(url: string): Promise<VideoDTO> {
  const res = await fetch("/api/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return (await parseJson<{ video: VideoDTO }>(res, toError)).video;
}

export async function getVideoRequest(id: string): Promise<VideoDTO> {
  const res = await fetch(`/api/videos/${id}`);
  return (await parseJson<{ video: VideoDTO }>(res, toError)).video;
}

export async function getTranscriptRequest(
  id: string,
): Promise<TranscriptLineDTO[]> {
  const res = await fetch(`/api/videos/${id}/transcript`);
  return (await parseJson<{ lines: TranscriptLineDTO[] }>(res, toError)).lines;
}
