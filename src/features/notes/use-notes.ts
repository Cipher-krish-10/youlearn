"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import {
  createNoteRequest,
  deleteNoteRequest,
  listNotesRequest,
} from "@/features/notes/api";

export function useNotes() {
  return useQuery({
    queryKey: queryKeys.notes.all,
    queryFn: listNotesRequest,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNoteRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNoteRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.notes.all }),
  });
}
