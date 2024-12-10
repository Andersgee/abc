import { initTRPC } from "@trpc/server";

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
  transformer: {
    deserialize(object) {
      return object;
    },
    serialize(object) {
      return object;
    },
  },
  //transformer: (x) => x,
  //transformer: //no need, indexedDB handles any native js types including bigint, date and uint8array
});

export const { router, createCallerFactory } = t;

export const publicProcedure = t.procedure;
