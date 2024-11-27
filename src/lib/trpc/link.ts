import { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { AppRouter } from "./router";

export const customLink: TRPCLink<AppRouter> = () => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      console.log("performing operation:", op);
      const unsubscribe = next(op).subscribe({
        next(value) {
          console.log("we received value", value);
          observer.next(value);
        },
        error(err) {
          console.log("we received error", err);
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};
