import type { DB } from "./schema";

export function db() {
  if (!window.db) throw new Error("no window.db");
  return window.db;
}

function read<T extends keyof DB>(tableName: T) {
  return db().transaction(tableName, "readonly").objectStore(tableName);
}

function write<T extends keyof DB>(tableName: T) {
  return db().transaction(tableName, "readwrite").objectStore(tableName);
}

export async function dbget<T extends keyof DB>(
  tableName: T,
  query: IDBValidKey | IDBKeyRange
) {
  return new Promise<DB[T] | null>((resolve, reject) => {
    const req = read(tableName).get(query);
    req.onerror = () => reject();
    req.onsuccess = (e) => resolve((e.target as IDBRequest).result ?? null);
  });
}

export async function dbgetKey<T extends keyof DB>(
  tableName: T,
  query: IDBValidKey | IDBKeyRange
) {
  return new Promise<DB[T]["id"] | null>((resolve, reject) => {
    const req = read(tableName).getKey(query);
    req.onerror = () => reject();
    req.onsuccess = (e) => resolve((e.target as IDBRequest).result ?? null);
  });
}

export async function dbgetAll<T extends keyof DB>(
  tableName: T,
  query?: IDBValidKey | IDBKeyRange | null,
  count?: number
) {
  return new Promise<Array<DB[T]>>((resolve, reject) => {
    const req = read(tableName).getAll(query, count);
    req.onerror = () => reject();
    req.onsuccess = (e) => resolve((e.target as IDBRequest).result);
  });
}

export async function dbgetAllKeys<T extends keyof DB>(
  tableName: T,
  query?: IDBValidKey | IDBKeyRange | null,
  count?: number
) {
  return new Promise<Array<DB[T]["id"]>>((resolve, reject) => {
    const req = read(tableName).getAllKeys(query, count);
    req.onerror = () => reject();
    req.onsuccess = (e) => resolve((e.target as IDBRequest).result);
  });
}

export async function dbcount<T extends keyof DB>(tableName: T) {
  return new Promise<number>((resolve, reject) => {
    const req = read(tableName).count();
    req.onerror = () => reject();
    req.onsuccess = (e) => resolve((e.target as IDBRequest).result);
  });
}

export async function dbadd<T extends keyof DB, V extends DB[T]>(
  tableName: T,
  value: V
) {
  return new Promise<DB[T]["id"]>((resolve, reject) => {
    const req = write(tableName).add(value);
    req.onerror = () => reject();
    req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
  });
}

export async function dbclear<T extends keyof DB>(tableName: T) {
  return new Promise<void>((resolve, reject) => {
    const req = write(tableName).clear();
    req.onerror = () => reject();
    req.onsuccess = () => resolve();
  });
}

export async function dbput<T extends keyof DB, V extends DB[T]>(
  tableName: T,
  value: V
) {
  return new Promise<DB[T]["id"]>((resolve, reject) => {
    const req = write(tableName).put(value);
    req.onerror = () => reject();
    req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
  });
}

export async function dbdelete<T extends keyof DB>(
  tableName: T,
  query: IDBValidKey | IDBKeyRange
) {
  return new Promise<void>((resolve, reject) => {
    const req = write(tableName).delete(query);
    req.onerror = () => reject();
    req.onsuccess = () => resolve();
  });
}

export async function dbopenCursor<T extends keyof DB>(
  tableName: T,
  query?: IDBValidKey | IDBKeyRange | null,
  direction?: IDBCursorDirection
) {
  return new Promise<IDBCursorWithValue>((resolve, reject) => {
    const req = read(tableName).openCursor(query, direction);
    req.onerror = () => reject();
    req.onsuccess = (event) => {
      const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
      resolve(cursor);
    };
  });
}
export async function dbopenCursorCallback<T extends keyof DB>(
  tableName: T,
  cb: (value: DB[T]) => void,
  query?: IDBValidKey | IDBKeyRange | null,
  direction?: IDBCursorDirection
) {
  return new Promise<void>((resolve, reject) => {
    const req = read(tableName).openCursor(query, direction);
    req.onerror = () => reject();
    req.onsuccess = (event) => {
      const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;

      if (cursor) {
        cb(cursor.value);
        cursor.continue();
      } else {
        // no more results
        resolve();
      }
    };
  });
}

export async function dbfilter<T extends keyof DB>(
  tableName: T,
  predicate: (value: DB[T]) => boolean
) {
  const rows: Array<DB[T]> = [];
  await dbopenCursorCallback(tableName, (value) => {
    if (predicate(value)) {
      rows.push(value);
    }
  });
  return rows;
}

/** custom  */
export async function dbfilter_good<T extends keyof DB>(
  tableName: T,
  predicate: (value: DB[T]) => boolean
) {
  return new Promise<Array<DB[T]>>((resolve, reject) => {
    const rows: Array<DB[T]> = [];

    const req = read(tableName).openCursor();

    req.onerror = () => reject();
    req.onsuccess = (event) => {
      const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;

      if (cursor) {
        if (predicate(cursor.value)) {
          rows.push(cursor.value);
        }
        cursor.continue();
      } else {
        // no more results
        resolve(rows);
      }
    };
  });
}
