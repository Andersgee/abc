import { observable } from "@trpc/server/observable";
import { TRPCClientError } from "@trpc/client";
import type { TRPCLink } from "@trpc/client";
import { idbRouter, type IdbRouter } from "./router";
import { createCallerFactory } from "./trpc";

const createCaller = createCallerFactory(idbRouter);
const caller = createCaller({});

export function idbLink(): TRPCLink<IdbRouter> {
  return () => {
    return ({ op }) => {
      return observable((observer) => {
        const { path, input, type } = op;

        caller[path](input)
          .then((res) => {
            observer.next({
              result: { data: res },
            });
            observer.complete();
          })
          .catch((cause) => {
            observer.error(TRPCClientError.from(cause));
          });

        return () => {
          // noop
        };
      });
    };
  };
}
