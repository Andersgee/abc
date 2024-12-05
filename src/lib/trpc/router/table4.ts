import { z } from "zod";
import { sleep } from "../../../utils/sleep";
import { db } from "../../db/client";
import { Table4, zTable4, zTable4Content, zTable4Id } from "../../db/schema";
import { publicProcedure, router } from "../trpc";

const TABLE_NAME = "table4";

async function iterateCursor<T>(cursor: IDBCursorWithValue) {
  return new Promise<T[]>((resolve) => {
    //const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
    const rows: T[] = [];
    if (cursor) {
      // cursor.value contains the current record being iterated through
      // this is where you'd do something with the result
      rows.push(cursor.value);
      cursor.continue();
    } else {
      // no more results
      resolve(rows);
    }
  });
}

const zPredicate = z.function().args(zTable4).returns(z.boolean());

export const table4Router = router({
  filter: publicProcedure.input(zPredicate).query(async ({ input }) => {
    await sleep();

    return new Promise<Table4[]>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readonly")
        .objectStore(TABLE_NAME)
        .openCursor(null, "next");

      //const rows = [];
      req.onerror = () => reject();
      req.onsuccess = (event) => {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;

        if (cursor) {
          // cursor.value contains the current record being iterated through
          // this is where you'd do something with the result
          if (input(cursor.value)) {
            console.log("true, include:", cursor.value);
          } else {
            console.log("false (dont include):", cursor.value);
          }
          cursor.continue();
        } else {
          // no more results
          //resolve((event.target as IDBRequest).result);
          resolve([]);
        }
      };
    });
  }),

  getAllWithCursor: publicProcedure.input(z.object({})).query(async () => {
    await sleep();

    return new Promise<Table4[]>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readonly")
        .objectStore(TABLE_NAME)
        .openCursor(null, "next");

      //const rows = [];
      req.onerror = () => reject();
      req.onsuccess = (event) => {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;

        if (cursor) {
          // cursor.value contains the current record being iterated through
          // this is where you'd do something with the result
          //console.log("cursor.value:", cursor.value);
          cursor.continue();
        } else {
          // no more results
          //resolve((event.target as IDBRequest).result);
          resolve([]);
        }
      };
    });
  }),
  getAll: publicProcedure.query(async () => {
    await sleep();

    return new Promise<Table4[]>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readonly")
        .objectStore(TABLE_NAME)
        .getAll();

      req.onerror = () => reject();
      req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
    });
  }),
  get: publicProcedure.input(zTable4Id).query(async ({ input }) => {
    await sleep();

    return new Promise<Table4 | null>((resolve, reject) => {
      const req = db()
        .transaction(TABLE_NAME, "readonly")
        .objectStore(TABLE_NAME)
        .get(input.id);

      req.onerror = () => reject();
      req.onsuccess = (event) =>
        resolve((event.target as IDBRequest).result ?? null);
    });
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
