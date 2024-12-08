import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from "@tanstack/react-query";
import { idbapi } from "./hook";
//import { debugLink } from "./debug-link";
import { routerCallerLink } from "./router-caller-link";

const queryClient = new QueryClient({
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
      //placeholderData: (x) => x, // aka keepPreviousData
      placeholderData: keepPreviousData,

      //retry: 3,
      //retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      //the default JSON.sringify will error on anything without .toJSON() method. like bigint or typed arrays etc
      //queryKeyHashFn: (k) => JSONE.stringify(k),
    },
  },
});

export const trpcClient = idbapi.createClient({
  //links: [debugLink, routerCallerLink()],
  links: [routerCallerLink()],
});

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  return (
    <idbapi.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </idbapi.Provider>
  );
}
