import { QueryClientProvider } from "@tanstack/react-query";
import { idbapi } from "./hook";
import { queryClient, trpcClient } from "./trpc-client";

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  return (
    <idbapi.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </idbapi.Provider>
  );
}
