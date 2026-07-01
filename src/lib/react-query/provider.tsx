"use client";

import { useState, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 min — fewer refetches on navigation.
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a fresh client per request.
    return makeQueryClient();
  }
  // Browser: reuse one client across renders (survives Suspense).
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // useState ensures the client is created once per component lifecycle.
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
