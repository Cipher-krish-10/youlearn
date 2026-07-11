"use client";

import { useQuery } from "@tanstack/react-query";
import { parseJson } from "@/lib/api/parse-json";
import { ApiError } from "@/features/ingestion/types";
import type { QuotaKind } from "@/core/interfaces/repositories";

export interface UsageDTO {
  plan: string;
  month: string;
  counts: Record<QuotaKind, number>;
  limits: Record<QuotaKind, number> | null;
}

const toError = (code: string, message: string, status: number) =>
  new ApiError(code as ApiError["code"], message, status);

export const USAGE_QUERY_KEY = ["me", "usage"] as const;

export function useUsage() {
  return useQuery({
    queryKey: USAGE_QUERY_KEY,
    queryFn: async (): Promise<UsageDTO> => {
      const res = await fetch("/api/me/usage");
      return (await parseJson<{ usage: UsageDTO }>(res, toError)).usage;
    },
    staleTime: 30_000,
  });
}
