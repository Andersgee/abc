import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./trpc";
import { customLink } from "../custom-link";
import { idbLink } from "../idb-link";
//import { trpc } from './utils/trpc';

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            enabled: true,
            staleTime: Infinity,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retryOnMount: true,
            throwOnError: false,
            retry: false,
            //retry: 3,
            //retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            //the default JSON.sringify will error on anything without .toJSON() method. like bigint or typed arrays etc
            //queryKeyHashFn: (k) => JSONE.stringify(k),
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        customLink,
        idbLink(),
        //httpBatchLink({
        //  url: "http://localhost:3000/trpc",
        //}),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
