import { parseJson } from "@/lib/api/parse-json";
import { ApiError } from "@/features/ingestion/types";
import type {
  CollectionDTO,
  CollectionDetailDTO,
} from "@/features/collections/types";

const toError = (code: string, message: string, status: number) =>
  new ApiError(code as ApiError["code"], message, status);

export async function listCollectionsRequest(): Promise<CollectionDTO[]> {
  const res = await fetch("/api/collections");
  return (await parseJson<{ collections: CollectionDTO[] }>(res, toError))
    .collections;
}

export async function createCollectionRequest(input: {
  name: string;
  description?: string | null;
}): Promise<CollectionDTO> {
  const res = await fetch("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return (await parseJson<{ collection: CollectionDTO }>(res, toError))
    .collection;
}

export async function deleteCollectionRequest(id: string): Promise<void> {
  const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
  await parseJson(res, toError);
}

export async function getCollectionRequest(
  id: string,
): Promise<CollectionDetailDTO> {
  const res = await fetch(`/api/collections/${id}`);
  return parseJson<CollectionDetailDTO>(res, toError);
}

export async function addVideoToCollectionRequest(
  collectionId: string,
  videoId: string,
): Promise<void> {
  const res = await fetch(`/api/collections/${collectionId}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId }),
  });
  await parseJson(res, toError);
}

export async function removeVideoFromCollectionRequest(
  collectionId: string,
  videoId: string,
): Promise<void> {
  const res = await fetch(
    `/api/collections/${collectionId}/videos/${videoId}`,
    { method: "DELETE" },
  );
  await parseJson(res, toError);
}
