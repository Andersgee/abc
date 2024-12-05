import { db } from "./client";

export async function initIndexedDB(
  name = "MyTestDatabase1",
  version = 3
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const openDbRequest = indexedDB.open(name, version);
    openDbRequest.onerror = () => {
      console.log("request.onerror");
      reject();
    };

    openDbRequest.onsuccess = (event) => {
      console.log("request.onsuccess");
      window.db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };

    openDbRequest.onupgradeneeded = handlUpgradeNeeded;
  });
}

type IndexDef = { name: string; options?: IDBIndexParameters };

function handlUpgradeNeeded(event: IDBVersionChangeEvent) {
  const request = event.target as IDBOpenDBRequest;
  window.db = request.result;
  const tx = request.transaction!;

  const table4 =
    createTable("table4", {
      keyPath: "id",
    }) ?? tx.objectStore("table4");

  const existingIndexNames = listFromDOMStringList(table4.indexNames);
  const desiredIndexes: IndexDef[] = [
    //{
    //  name: "korp",
    //  options: { unique: false },
    //},
    { name: "hello", options: { unique: true } },
  ];
  const desiredIndexNames = desiredIndexes.map((x) => x.name);

  const indexNamesToRemove = existingIndexNames.filter(
    (x) => !desiredIndexNames.includes(x)
  );

  console.log(
    JSON.stringify(
      {
        existingIndexNames,
        //indexNamesToAdd,
        indexNamesToRemove,
      },
      null,
      2
    )
  );

  //First of all, remove unwanted cols
  for (const indexName of indexNamesToRemove) {
    deleteColumn(table4, indexName);
  }

  //next add indexes
  for (const index of desiredIndexes) {
    createColumn(table4, index);
    //table4.createIndex(indexName, indexName);
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

function checkCurrentIndexOptionsAndMaybeDeleteIt(
  table: IDBObjectStore,
  index: IndexDef
) {
  try {
    console.log("checking index:", JSON.stringify(index));
    const existingIsUnique = table.index(index.name).unique;
    const newIsUnique = index.options?.unique ?? false;
    if (existingIsUnique !== newIsUnique) {
      console.log("the new does not have the same unique as the old");
      console.log({ existingIsUnique, newIsUnique });
      deleteColumn(table, index.name);
    }
  } catch (error) {
    console.log("reading existing index error:", error);
  }
}

function createColumn(
  table: IDBObjectStore,
  index: IndexDef
  //indexName: string,
  //options?: IDBIndexParameters
) {
  try {
    checkCurrentIndexOptionsAndMaybeDeleteIt(table, index);
    table.createIndex(index.name, index.name, index.options);
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn("createIndex, error.name:", error.name);
      console.warn("this is the index: ", JSON.stringify(index));
      console.warn("and this is the error: ", error);
    } else {
      console.warn("createIndex, other error:", error);
    }
  }
}

function deleteColumn(table: IDBObjectStore, indexName: string) {
  try {
    table.delete(indexName);
    table.deleteIndex(indexName);
  } catch (error) {
    console.warn("deleteIndex, error:", error);
  }
}

function listFromDOMStringList(indexNames: DOMStringList) {
  const v: string[] = [];
  for (let i = 0; i < indexNames.length; i++) {
    v.push(indexNames.item(i)!);
  }
  return v;
}
