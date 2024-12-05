import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { idb } from "./hook";
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

      //retry: 3,
      //retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      //the default JSON.sringify will error on anything without .toJSON() method. like bigint or typed arrays etc
      //queryKeyHashFn: (k) => JSONE.stringify(k),
    },
  },
});

const trpcClient = idb.createClient({
  //links: [debugLink, routerCallerLink()],
  links: [routerCallerLink()],
});

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  return (
    <idb.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </idb.Provider>
  );
}
