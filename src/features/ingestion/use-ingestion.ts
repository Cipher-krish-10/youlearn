"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { ApiError } from "@/features/ingestion/types";
import {
  getTranscriptRequest,
  getVideoRequest,
  ingestVideoRequest,
  listVideosRequest,
} from "@/features/ingestion/api";

/** The user's library, newest first. */
export function useVideos() {
  return useQuery({
    queryKey: queryKeys.videos.list(),
    queryFn: listVideosRequest,
  });
}

/** Run the ingestion pipeline. On success, refresh any library lists. */
export function useIngestVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => ingestVideoRequest(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: queryKeys.videos.detail(id),
    queryFn: () => getVideoRequest(id),
    // A genuinely missing video won't appear on retry.
    retry: (count, error) =>
      !(error instanceof ApiError && error.status === 404) && count < 2,
  });
}

export function useTranscript(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.transcript.byVideo(id),
    queryFn: () => getTranscriptRequest(id),
    enabled,
    retry: false,
  });
}
