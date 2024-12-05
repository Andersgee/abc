import { z } from "zod";
import { sleep } from "../../../utils/sleep";
import {
  db,
  dbadd,
  dbclear,
  dbcount,
  dbdelete,
  dbfilter,
  dbget,
  dbgetAll,
  dbput,
} from "../../db/client";
import { Table4, zTable4, zTable4Content, zTable4Id } from "../../db/schema";
import { publicProcedure, router } from "../trpc";

//
const TABLE_NAME = "table4";

//const zPredicate = z.function().args(zTable4).returns(z.boolean());

export const table4Router = router({
  filter: publicProcedure
    .input(z.object({ value: z.string() }))
    .query(async ({ input }) => {
      await sleep(3000);
      return await dbfilter("table4", ({ hello }) =>
        hello.includes(input.value)
      );
    }),

  //this is a bit whack but since its all client side we can send the function itself to the route
  filterWithFunction: publicProcedure
    .input(z.function().args(zTable4).returns(z.boolean()))
    .query(async ({ input }) => {
      await sleep();
      return await dbfilter("table4", input);
    }),

  getAllWithCursor: publicProcedure.input(z.object({})).query(async () => {
    await sleep();

    return new Promise((resolve, reject) => {
      const rows: Table4[] = [];
      const req = db()
        .transaction(TABLE_NAME, "readonly")
        .objectStore(TABLE_NAME)
        .openCursor(null, "next");

      req.onerror = () => reject();
      req.onsuccess = (event) => {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;

        if (cursor) {
          rows.push(cursor.value);
          cursor.continue();
        } else {
          resolve(rows);
        }
      };
    });
  }),
  getAll: publicProcedure.query(async () => {
    await sleep();
    return await dbgetAll("table4");
  }),
  get: publicProcedure.input(zTable4Id).query(async ({ input }) => {
    await sleep();
    return await dbget("table4", input.id);
  }),
  count: publicProcedure.query(async () => {
    await sleep();
    return await dbcount("table4");
  }),
  add: publicProcedure.input(zTable4).mutation(async ({ input }) => {
    await sleep();
    return await dbadd("table4", input);
  }),

  clear: publicProcedure.mutation(async () => {
    await sleep();
    return await dbclear("table4");
  }),

  put: publicProcedure.input(zTable4).mutation(async ({ input }) => {
    await sleep();
    return await dbput("table4", input);
  }),

  delete: publicProcedure.input(zTable4Id).mutation(async ({ input }) => {
    await sleep();
    return await dbdelete("table4", input.id);
  }),
});
