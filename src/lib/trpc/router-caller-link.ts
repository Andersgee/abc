import { observable } from "@trpc/server/observable";
import { TRPCClientError } from "@trpc/client";
import type { TRPCLink } from "@trpc/client";
import { idbRouter, type IdbRouter } from "./router";
import { createCallerFactory } from "./trpc";

const createCaller = createCallerFactory(idbRouter);
const caller = createCaller({});

export function routerCallerLink(): TRPCLink<IdbRouter> {
  return () => {
    return ({ op }) => {
      return observable((observer) => {
        const { path, input } = op;

        // @ts-expect-error this works
        caller[path](input)
          .then((res: unknown) => {
            observer.next({
              result: { data: res },
            });
            observer.complete();
          })
          .catch((cause: unknown) => {
            // @ts-expect-error meh
            observer.error(TRPCClientError.from(cause));
          });

        return () => {
          // noop
        };
      });
    };
  };
}
