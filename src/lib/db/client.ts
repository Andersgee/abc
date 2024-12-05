import type { DB } from "./schema";

export function db() {
  if (!window.db) throw new Error("no window.db");
  return window.db;
}

export function dbget<T extends keyof DB>(
  tableName: T,
  query: IDBValidKey | IDBKeyRange
) {
  return new Promise<DB[T] | null>((resolve, reject) => {
    const req = db()
      .transaction(tableName, "readonly")
      .objectStore(tableName)
      .get(query);

    req.onerror = () => reject();
    req.onsuccess = (e) => resolve((e.target as IDBRequest).result ?? null);
  });
}

export function dbgetAll<T extends keyof DB>(tableName: T) {
  return new Promise<Array<DB[T]>>((resolve, reject) => {
    const req = db()
      .transaction(tableName, "readonly")
      .objectStore(tableName)
      .getAll();

    req.onerror = () => reject();
    req.onsuccess = (e) => resolve((e.target as IDBRequest).result);
  });
}

/*
export async function setItem(obj: X) {
  const storeName = "bodypart";
  return new Promise((resolve, reject) => {
    if (db) {
      const store = db
        .transaction("bodypart", "readwrite")
        .objectStore(storeName);

      const req = store.put(obj);
      req.onsuccess = (event) => {
        resolve(event.target.result);
      };
      req.onerror = (event) => {
        reject(event.target.error?.message);
      };
    } else {
      reject();
    }
  });
}
*/
