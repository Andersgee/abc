import { observable } from "@trpc/server/observable";
import { sleep } from "../../utils/sleep";

import { TRPCClientError, TRPCLink } from "@trpc/client";
import type { AppRouter } from "./router";

export function idbLink(): TRPCLink<AppRouter> {
  return () => {
    return ({ op }) => {
      return observable((observer) => {
        const { path, input, type } = op;

        sleep()
          .then(() => {
            //doStuff({});
            //const hmm = routerCaller[path](input);
            //const caller = createCaller({});
            //caller.userList({ hello: "mmamamamama" });

            observer.next({
              //context: res.meta,
              result: {
                data: { welp: "gfgfdgdfgd" },
                //type: "data",
              },
            });
            observer.complete();
          })
          .catch((cause) => {
            observer.error(TRPCClientError.from(cause, { meta }));
          });

        /*

        const request = universalRequester({
          ...resolvedOpts,
          type,
          path,
          input,
          signal: op.signal,
          headers() {
            if (!opts.headers) {
              return {};
            }
            if (typeof opts.headers === 'function') {
              return opts.headers({
                op,
              });
            }
            return opts.headers;
          },
        });
        let meta: HTTPResult['meta'] | undefined = undefined;

        
        request
          .then((res) => {
            meta = res.meta;
            const transformed = transformResult(
              res.json,
              resolvedOpts.transformer.output,
            );

            if (!transformed.ok) {
              observer.error(
                TRPCClientError.from(transformed.error, {
                  meta,
                }),
              );
              return;
            }
            observer.next({
              context: res.meta,
              result: transformed.result,
            });
            observer.complete();
          })
          .catch((cause) => {
            observer.error(TRPCClientError.from(cause, { meta }));
          });
          */

        return () => {
          // noop
        };
      });
    };
  };
}
