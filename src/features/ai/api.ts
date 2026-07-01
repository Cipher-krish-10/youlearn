import { parseJson } from "@/lib/api/parse-json";
import {
  AiRequestError,
  type Artifact,
  type ArtifactKind,
} from "@/features/ai/types";

const toError = (code: string, message: string, status: number) =>
  new AiRequestError(code as AiRequestError["code"], message, status);

/** Returns the cached artifact, or null when it hasn't been generated yet. */
export async function getArtifactRequest<K extends ArtifactKind>(
  videoId: string,
  kind: K,
): Promise<Artifact<K> | null> {
  const res = await fetch(`/api/videos/${videoId}/ai/${kind}`);
  if (res.status === 404) return null;
  return (await parseJson<{ artifact: Artifact<K> }>(res, toError)).artifact;
}

export async function generateArtifactRequest<K extends ArtifactKind>(
  videoId: string,
  kind: K,
  force = false,
): Promise<Artifact<K>> {
  const res = await fetch(
    `/api/videos/${videoId}/ai/${kind}${force ? "?force=1" : ""}`,
    { method: "POST" },
  );
  return (await parseJson<{ artifact: Artifact<K> }>(res, toError)).artifact;
}
