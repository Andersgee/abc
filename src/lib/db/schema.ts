import { z } from "zod";
import { zodKeys } from "../../utils/zod-keys";

export const zEntry = z.object({
  id: z.number(),
  x: z.number(),
  y: z.date(),
  label: z.string(),
  comment: z.string(),
  completed: z.boolean(),
});
//export type Entry = z.infer<typeof zEntry>;

export const zDB = z.object({
  entry: zEntry,
});

export type DB = z.infer<typeof zDB>;

export function handlUpgradeNeeded(event: IDBVersionChangeEvent) {
  const request = event.target as IDBOpenDBRequest;
  window.db = request.result;

  //todo handle migration aka upgrade properly
  const tx = request.transaction!; //this is needed to query for existing tables / indexes,

  /*
  for (const [tableName, schema] of Object.entries(zDB.shape)) {
    console.log("would create tableName:", tableName);

    for (const colName of zodKeys(schema)) {
      if (colName === "key") continue;
      console.log("would create colName", colName);
    }
  }
  */

  for (const [tableName, schema] of Object.entries(zDB.shape)) {
    console.log("tableName:", tableName);

    //create (or get already existing) table
    const table =
      createTable(tableName, { keyPath: "id", autoIncrement: true }) ??
      tx.objectStore(tableName);

    for (const colName of zodKeys(schema)) {
      if (colName === "id") continue;
      console.log("would create colName", colName);

      //todo ignore if this exists?
      createColumn(table, colName, { multiEntry: false, unique: false });
    }
  }
}

function createTable(tableName: string, options?: IDBObjectStoreParameters) {
  try {
    const table = db().createObjectStore(tableName, options);
    return table;
  } catch (error) {
    if (error instanceof DOMException && error.name === "ConstraintError") {
      //expected if table already exist
    } else {
      console.warn("createObjectStore, error:", error);
    }
  }
}

function createColumn(
  table: IDBObjectStore,
  indexName: string,
  options?: IDBIndexParameters
) {
  try {
    //checkCurrentIndexOptionsAndMaybeDeleteIt(table, index);
    table.createIndex(indexName, indexName, options);
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn("createIndex, error.name:", error.name);
      console.warn("and this is the error: ", error);
    } else {
      console.warn("createIndex, other error:", error);
    }
  }
}

function db() {
  if (!window.db) throw new Error("no window.db");
  return window.db;
}
