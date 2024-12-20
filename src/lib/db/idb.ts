//import type { DB } from "./schema";

export function db() {
  if (!window.db) throw new Error("no window.db");
  return window.db;
}

export class Idb<DB extends Record<string, { id: IDBValidKey }>> {
  constructor() {
    //init
  }
  read<T extends keyof DB & string>(tableName: T) {
    return db().transaction(tableName, "readonly").objectStore(tableName);
  }
  write<T extends keyof DB & string>(tableName: T) {
    return db().transaction(tableName, "readwrite").objectStore(tableName);
  }

  // IDBObjectStore instance methods
  // https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore

  get<T extends keyof DB & string>(
    tableName: T,
    query: IDBValidKey | IDBKeyRange
  ) {
    return new Promise<DB[T] | null>((resolve, reject) => {
      const req = this.read(tableName).get(query);
      req.onerror = () => reject();
      req.onsuccess = (e) => resolve((e.target as IDBRequest).result ?? null);
    });
  }

  getKey<T extends keyof DB & string>(
    tableName: T,
    query: IDBValidKey | IDBKeyRange
  ) {
    return new Promise<DB[T]["id"] | null>((resolve, reject) => {
      const req = this.read(tableName).getKey(query);
      req.onerror = () => reject();
      req.onsuccess = (e) => resolve((e.target as IDBRequest).result ?? null);
    });
  }

  getAll<T extends keyof DB & string>(
    tableName: T,
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ) {
    return new Promise<Array<DB[T]>>((resolve, reject) => {
      const req = this.read(tableName).getAll(query, count);
      req.onerror = () => reject();
      req.onsuccess = (e) => resolve((e.target as IDBRequest).result);
    });
  }

  getAllKeys<T extends keyof DB & string>(
    tableName: T,
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ) {
    return new Promise<Array<DB[T]["id"]>>((resolve, reject) => {
      const req = this.read(tableName).getAllKeys(query, count);
      req.onerror = () => reject();
      req.onsuccess = (e) => resolve((e.target as IDBRequest).result);
    });
  }

  count<T extends keyof DB & string>(tableName: T) {
    return new Promise<number>((resolve, reject) => {
      const req = this.read(tableName).count();
      req.onerror = () => reject();
      req.onsuccess = (e) => resolve((e.target as IDBRequest).result);
    });
  }

  //omit key assuming autoincrement.
  add<T extends keyof DB & string, V extends DB[T]>(
    tableName: T,
    value: Omit<V, "id">
  ) {
    return new Promise<DB[T]["id"]>((resolve, reject) => {
      const req = this.write(tableName).add(value);
      req.onerror = () => reject();
      req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
    });
  }

  clear<T extends keyof DB & string>(tableName: T) {
    return new Promise<void>((resolve, reject) => {
      const req = this.write(tableName).clear();
      req.onerror = () => reject();
      req.onsuccess = () => resolve();
    });
  }

  /** note: behaviour of 'put' is equivalent to 'add' if theres no record with that key */
  put<T extends keyof DB & string, V extends DB[T]>(tableName: T, value: V) {
    return new Promise<DB[T]["id"]>((resolve, reject) => {
      const req = this.write(tableName).put(value);
      req.onerror = () => reject();
      req.onsuccess = (event) => resolve((event.target as IDBRequest).result);
    });
  }

  delete<T extends keyof DB & string>(
    tableName: T,
    query: IDBValidKey | IDBKeyRange
  ) {
    return new Promise<void>((resolve, reject) => {
      const req = this.write(tableName).delete(query);
      req.onerror = () => reject();
      req.onsuccess = () => resolve();
    });
  }

  ///////////////
  // utilities //
  ///////////////

  /** note: you cant update the value.key this way (or any way) */
  update<T extends keyof DB & string, V extends DB[T]>(
    tableName: T,
    value: Partial<V> & { id: DB[T]["id"] }
  ) {
    return new Promise<DB[T]["id"]>((resolve, reject) => {
      const req = this.write(tableName).openCursor(value.id);
      req.onerror = () => reject();
      req.onsuccess = (event) => {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;

        if (cursor) {
          if (cursor.key === value.id) {
            //meh: this equals check doesnt work for Date or Array etc which are also allowed 'IDBValidKey'
            cursor.update({ ...cursor.value, ...value });
          }
          //cb(cursor.value);
          cursor.continue();
        } else {
          // no more results
          resolve(value.id);
        }
      };
    });
  }

  openCursorCallback<T extends keyof DB & string>(
    tableName: T,
    cb: (value: DB[T]) => void,
    query?: Query,
    direction?: IDBCursorDirection
  ) {
    return new Promise<void>((resolve, reject) => {
      const req = this.read(tableName).openCursor(keyRange(query), direction);
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

  async filter<T extends keyof DB & string>(
    tableName: T,
    predicate: (value: DB[T]) => boolean
  ) {
    const rows: Array<DB[T]> = [];
    await this.openCursorCallback(tableName, (value) => {
      if (predicate(value)) {
        rows.push(value);
      }
    });
    return rows;
  }
}

type Query =
  | IDBValidKey
  | {
      lower?: IDBValidKey;
      upper?: IDBValidKey;
      lowerOpen?: boolean;
      upperOpen?: boolean;
    };

function keyRange(query?: Query) {
  if (query === undefined) return null; //all records

  if (typeof query === "object" && ("lower" in query || "upper" in query)) {
    if (query.lower !== undefined && query.upper !== undefined) {
      return IDBKeyRange.bound(
        query.lower,
        query.upper,
        query.lowerOpen,
        query.upperOpen
      );
    } else if (query.lower !== undefined) {
      return IDBKeyRange.lowerBound(query.lower, query.lowerOpen);
    } else if (query.upper !== undefined) {
      return IDBKeyRange.upperBound(query.upper, query.upperOpen);
    } else {
      return null;
    }
  } else {
    return query as IDBValidKey;
  }
}

//const x = new Idb<{hello: {key:string, apa:string}}>()
//x.add("hello",{key:"1",apa:""}).then(res=>{
//  res
//})
