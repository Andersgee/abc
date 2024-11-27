import { observable } from "@trpc/server/observable";
import { sleep } from "../../utils/sleep";

import { TRPCClientError } from "@trpc/client";
import type { OperationResultEnvelope, type TRPCLink } from "@trpc/client";
import { appRouter, type AppRouter } from "./server/router";
import { createCallerFactory } from "./server/trpc";

const createCaller = createCallerFactory(appRouter);

const routerCaller = createCaller({});

export function idbLink(): TRPCLink<AppRouter> {
  return () => {
    return ({ op }) => {
      return observable((observer) => {
        const { path, input, type } = op;

        routerCaller[path](input)
          .then((res) => {
            //doStuff({});
            //const hmm = routerCaller[path](input);
            //const caller = createCaller({});
            //caller.userList({ hello: "mmamamamama" });
            console.log("after routerCaller.greeting in idbLink.");

            observer.next({
              //context: res.meta,
              result: {
                data: res,
                //type: "data",
              },
            });
            observer.complete();
          })
          .catch((cause) => {
            //observer.error(TRPCClientError.from(cause, { meta }));
            observer.error(TRPCClientError.from(cause));
          });

        return () => {
          // noop
        };
      });
    };
  };
}
