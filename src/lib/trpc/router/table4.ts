import { sleep } from "../../../utils/sleep";
import { db } from "../../db/client";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const zId = z.object({ id: z.number() });
const zContent = z.object({
  hello: z.string(),
});

const zTable4 = zId.merge(zContent);
type Table4Row = z.infer<typeof zTable4>;

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
  get: publicProcedure.input(zId).query(async ({ input }) => {
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
  add: publicProcedure.input(zContent).mutation(async ({ input }) => {
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

  put: publicProcedure.input(zTable4).mutation(async ({ input }) => {
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

  delete: publicProcedure.input(zId).mutation(async ({ input }) => {
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
