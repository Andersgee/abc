import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { idb } from "./lib/idb";
//import { asyncStorage, type AsyncStorageKey } from "#/utils/async-storage";

type Key = "Bill" | "Donna";

/*
tanstack query is general for any external async data
which is what async-storage is, its data placed on the phone itself, with an async api to get and set data

btw, this still allows normal usage eg asyncStorage.getItem("vehicleId") from outside react
*/

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

export function useIndexedDbQuery(key: Key) {
  return useQuery(
    {
      queryKey: [key],
      queryFn: () => idb.getItem(key),
    },
    queryClient
  );
}

type X = {
  name: string;
} & Record<string, unknown>;

export function useIndexedDbMutation(key: Key) {
  return useMutation(
    {
      mutationFn: (input: Omit<X, "name">) => {
        return idb.setItem({ name: key, ...input });
        /*
        if (input === null) {
          return asyncStorage.removeItem(key);
        } else {
          return asyncStorage.setItem(key, input);
        }
        */
      },
      onSuccess: (_data, variables, _context) => {
        queryClient.setQueryData([key], { name: key, ...variables });
      },
    },
    queryClient
  );
}
