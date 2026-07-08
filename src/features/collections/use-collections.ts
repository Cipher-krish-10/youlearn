"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import {
  addVideoToCollectionRequest,
  createCollectionRequest,
  deleteCollectionRequest,
  getCollectionRequest,
  listCollectionsRequest,
  removeVideoFromCollectionRequest,
} from "@/features/collections/api";

const detailKey = (id: string) => ["collections", "detail", id] as const;

export function useCollection(id: string) {
  return useQuery({
    queryKey: detailKey(id),
    queryFn: () => getCollectionRequest(id),
  });
}

export function useAddVideoToCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (v: { collectionId: string; videoId: string }) =>
      addVideoToCollectionRequest(v.collectionId, v.videoId),
    onSuccess: (_r, v) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
      queryClient.invalidateQueries({ queryKey: detailKey(v.collectionId) });
    },
  });
}

export function useRemoveVideoFromCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (v: { collectionId: string; videoId: string }) =>
      removeVideoFromCollectionRequest(v.collectionId, v.videoId),
    onSuccess: (_r, v) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
      queryClient.invalidateQueries({ queryKey: detailKey(v.collectionId) });
    },
  });
}

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections.all,
    queryFn: listCollectionsRequest,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollectionRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }),
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollectionRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }),
  });
}
