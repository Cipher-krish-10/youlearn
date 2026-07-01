"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { Artifact, ArtifactKind } from "@/features/ai/types";
import {
  generateArtifactRequest,
  getArtifactRequest,
} from "@/features/ai/api";

/** Read a previously-generated artifact from cache (404 → null, no error). */
export function useArtifact<K extends ArtifactKind>(
  videoId: string,
  kind: K,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.ai.artifact(videoId, kind),
    queryFn: () => getArtifactRequest(videoId, kind),
    enabled,
    retry: false,
    staleTime: Infinity,
  });
}

/** Generate (or regenerate) an artifact, seeding the read cache on success. */
export function useGenerateArtifact<K extends ArtifactKind>(
  videoId: string,
  kind: K,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opts?: { force?: boolean }) =>
      generateArtifactRequest(videoId, kind, opts?.force),
    onSuccess: (artifact: Artifact<K>) => {
      queryClient.setQueryData(queryKeys.ai.artifact(videoId, kind), artifact);
    },
  });
}
