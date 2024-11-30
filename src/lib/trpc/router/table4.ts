import { sleep } from "../../../utils/sleep";
import { db } from "../../db/client";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

type Table4Row = {
  id: number;
  hello: string;
};

export const table4 = router({
  getAll: publicProcedure.query(async () => {
    await sleep();

    return new Promise<Table4Row[]>((resolve, reject) => {
      const req = db()
        .transaction("table4", "readonly")
        .objectStore("table4")
        .getAll();

      req.onerror = () => reject();
      req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
    });
  }),
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      await sleep();

      return new Promise<Table4Row | null>((resolve, reject) => {
        const req = db()
          .transaction("table4", "readonly")
          .objectStore("table4")
          .get(input.id);

        req.onerror = () => reject();
        req.onsuccess = (event) =>
          resolve((event.target as IDBRequest).result ?? null);
      });
    }),
  add: publicProcedure
    .input(z.object({ hello: z.string() }))
    .mutation(async ({ input }) => {
      await sleep();

      return new Promise<number>((resolve, reject) => {
        const req = db()
          .transaction("table4", "readwrite")
          .objectStore("table4")
          .add(input);

        req.onerror = () => reject();
        req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
      });
    }),

  clear: publicProcedure.mutation(async () => {
    await sleep();

    return new Promise<void>((resolve, reject) => {
      const req = db()
        .transaction("table4", "readwrite")
        .objectStore("table4")
        .clear();

      req.onerror = () => reject();
      req.onsuccess = () => resolve();
    });
  }),

  put: publicProcedure
    .input(z.object({ id: z.number(), hello: z.string() }))
    .mutation(async ({ input }) => {
      await sleep();

      return new Promise<number>((resolve, reject) => {
        const req = db()
          .transaction("table4", "readwrite")
          .objectStore("table4")
          .put(input);

        req.onerror = () => reject();
        req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await sleep();

      return new Promise<void>((resolve, reject) => {
        const req = db()
          .transaction("table4", "readwrite")
          .objectStore("table4")
          .delete(input.id);

        req.onerror = () => reject();
        req.onsuccess = () => resolve();
      });
    }),
});
