import { z } from "zod";

export const zPost = z.object({
  key: z.number(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const zStuff = z.object({
  key: z.number(),
  hello: z.string(),
});

export const zDB = z.object({
  post: zPost,
  stuff: zStuff,
});

export type DB = z.infer<typeof zDB>;

//for (const [tableName,schema] of Object.entries(zDB.shape)) {
//
//}

export function handlUpgradeNeeded(event: IDBVersionChangeEvent) {
  const request = event.target as IDBOpenDBRequest;
  window.db = request.result;

  //todo handle migration aka upgrade properly
  //const tx = request.transaction!; //this is needed to query for existing tables / indexes,

  for (const [tableName, schema] of Object.entries(zDB.shape)) {
    const table = createTable(tableName, { keyPath: "key" });
    if (!table) {
      console.warn("no table... :", tableName);
      continue;
    }
    for (const colName of Object.keys(schema)) {
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
