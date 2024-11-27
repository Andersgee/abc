"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { customLink } from "./link";
import { api } from "./api";
import { idbLink } from "./idb-link";

const trpcClient = api.createClient({
  links: [customLink, idbLink()],
});

//https://tanstack.com/query/v5/docs/react/guides/important-defaults

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: true,
      staleTime: Infinity,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: true,
      retryOnMount: true,
      throwOnError: false,
      retry: false,
      //retry: 3,
      //retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      //the default JSON.sringify will error on anything without .toJSON() method. like bigint or typed arrays etc
      //queryKeyHashFn: (k) => JSONE.stringify(k),
    },
  },
});

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
