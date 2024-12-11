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

export const zSettings = z.object({
  id: z.number(),
  showComments: z.boolean(),
  isEditing: z.boolean(),
});
//export type Entry = z.infer<typeof zEntry>;

export const zDB = z.object({
  entry: zEntry,
  settings: zSettings,
});

export type DB = z.infer<typeof zDB>;

/** important: this can not be async */
export function handlUpgradeNeeded(event: IDBVersionChangeEvent) {
  console.log("handlUpgradeNeeded");
  const request = event.target as IDBOpenDBRequest;
  window.db = request.result;

  //todo handle migration aka upgrade properly
  const tx = request.transaction!; //this is needed to query for existing tables / indexes,

  for (const [tableName, schema] of Object.entries(zDB.shape)) {
    console.log("tableName:", tableName);

    const existingTable = getExistingTable(tx, tableName);
    if (existingTable) {
      // dont handle "migrations"
      // by adding cols etc to existing tables, not sure if its even possible
      // I think the way to do this is to create a new table and later copy data into that
      // somethiing like this:
      //const req = existingTable.getAll()
      //req.onsuccess = (ev)=> {
      //  //someglobalobj[tableName] = ev.target.result
      //
      //}
      //and later read that someglobalobj and seed some other table with that data
      //probably with additional cols or without some cols
      //also clear that table after

      continue;
    }
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

function getExistingTable(tx: IDBTransaction, tableName: string) {
  try {
    const table = tx.objectStore(tableName);
    return table;
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotFoundError") {
      //expected if no table
    } else {
      console.warn("getExistingTable, error:", error);
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
      console.warn("createTable, error:", error);
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
