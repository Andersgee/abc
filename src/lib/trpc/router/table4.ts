import { sleep } from "../../../utils/sleep";
import { db } from "../../db/client";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const table4 = router({
  getAll: publicProcedure.query(async () => {
    await sleep(2000);

    return new Promise((resolve, reject) => {
      const req = db()
        .transaction("table4", "readonly")
        .objectStore("table4")
        .getAll();

      req.onerror = () => reject();
      req.onsuccess = (event) =>
        resolve(
          (event.target as IDBRequest).result as Array<{
            id: number;
            hello: string;
          }>
        );
    });
  }),
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      await sleep(2000);

      return new Promise((resolve, reject) => {
        const req = db()
          .transaction("table4", "readonly")
          .objectStore("table4")
          .get(input.id);

        req.onerror = () => reject();
        req.onsuccess = (event) =>
          resolve(
            (event.target as IDBRequest).result as Array<{
              id: number;
              hello: string;
            }>
          );
      });
    }),
  add: publicProcedure
    .input(z.object({ hello: z.string() }))
    .mutation(async ({ input }) => {
      await sleep(2000);

      return new Promise((resolve, reject) => {
        const req = db()
          .transaction("table4", "readwrite")
          .objectStore("table4")
          .add(input);

        req.onerror = () => reject();
        req.onsuccess = (event) =>
          resolve(
            (event.target as IDBRequest).result as Array<{
              id: number;
              hello: string;
            }>
          );
      });
    }),
  //mut: publicProcedure
  //  .input(z.object({ stuff: z.string() }))
  //  .mutation(async ({ input }) => {
  //    await sleep(2000);
  //    return { echoed_nested_mutation_input: input };
  //  }),
});
