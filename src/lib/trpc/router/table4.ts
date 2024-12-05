import { z } from "zod";
import { sleep } from "../../../utils/sleep";
import { db, dbget, dbgetAll } from "../../db/client";
import { Table4, zTable4, zTable4Content, zTable4Id } from "../../db/schema";
import { publicProcedure, router } from "../trpc";

//
const TABLE_NAME = "table4";

const zPredicate = z.function().args(zTable4).returns(z.boolean());

export const table4Router = router({
  filter: publicProcedure.input(zPredicate).query(async ({ input }) => {
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
          if (input(cursor.value)) {
            rows.push(cursor.value);
          }
          cursor.continue();
        } else {
          // no more results
          resolve(rows);
        }
      };
    });
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

    return new Promise<number>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readonly")
        .objectStore(TABLE_NAME)
        .count();

      req.onerror = () => reject();
      req.onsuccess = (event) =>
        resolve((event.target as IDBRequest).result ?? null);
    });
  }),
  add: publicProcedure.input(zTable4).mutation(async ({ input }) => {
    await sleep();

    return new Promise<string>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readwrite")
        .objectStore(TABLE_NAME)
        .add(input);

      req.onerror = () => reject();
      req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
    });
  }),

  clear: publicProcedure.mutation(async () => {
    await sleep();

    return new Promise<void>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readwrite")
        .objectStore(TABLE_NAME)
        .clear();

      req.onerror = () => reject();
      req.onsuccess = () => resolve();
    });
  }),

  put: publicProcedure.input(zTable4).mutation(async ({ input }) => {
    await sleep();

    return new Promise<string>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readwrite")
        .objectStore(TABLE_NAME)
        .put(input);

      req.onerror = () => reject();
      req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
    });
  }),

  delete: publicProcedure.input(zTable4Id).mutation(async ({ input }) => {
    await sleep();

    return new Promise<void>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readwrite")
        .objectStore(TABLE_NAME)
        .delete(input.id);

      req.onerror = () => reject();
      req.onsuccess = () => resolve();
    });
  }),
});
