import { db } from "./client";

export async function initIndexedDB(
  name = "MyTestDatabase2",
  version = 9
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

    /*
    openDbRequest.onupgradeneeded = (event) => {
      console.log("request.onupgradeneeded");
      window.db = (event.target as IDBOpenDBRequest).result;

      //push_table1();
      //push_table2();
      //push_table3();
      push_table4_synchronous();
    };
    */
    openDbRequest.onupgradeneeded = handlUpgradeNeeded;
  });

  //seed
  /*
  const TABLE_NAME = "table4";
  await new Promise<void>((resolve, reject) => {
    const table4 = db()
      .transaction(TABLE_NAME, "readwrite")
      .objectStore(TABLE_NAME);

    table4.transaction.onabort = () => {
      console.error("table4.transaction.onabort");
      reject();
    };
    table4.transaction.onerror = () => {
      console.error("table4.transaction.onerror");
      reject();
    };
    table4.transaction.oncomplete = () => {
      console.log("table4.transaction.oncomplete");
      resolve();
    };

    table4.add({ hello: "added without id hmmmm" });
    table4.add({ hello: "another added without id" });

    //giving your own id doesnt work
    //table4.add({ hello: "this one I gave my own id number", id: 3 });
    //table4.add({ hello: "this one I gave my own id number 7", id: 7 });
  });
  */

  //createColumn("table4", "somecol");
}

function listFromDOMStringList(indexNames: DOMStringList) {
  const v: string[] = [];
  for (let i = 0; i < indexNames.length; i++) {
    v.push(indexNames.item(i)!);
  }
  return v;
}

function handlUpgradeNeeded(event: IDBVersionChangeEvent) {
  // Get a reference to the request related to this event
  // @type IDBOpenRequest (a specialized type of IDBRequest)
  const request = event.target as IDBOpenDBRequest;

  // Get a reference to the IDBDatabase object for this request
  // @type IDBDatabase
  window.db = request.result;

  const tx = request.transaction!;

  const table4 = createTable("table4") ?? tx.objectStore("table4");

  const existingIndexNames = listFromDOMStringList(table4.indexNames);
  const desiredIndexNames = ["korp", "stuff"];

  //create missing indexes and remove indexes that should be here
  //possibly remove data before removing index?
  const indexNamesToAdd = desiredIndexNames.filter(
    (x) => !existingIndexNames.includes(x)
  );
  const indexNamesToRemove = existingIndexNames.filter(
    (x) => !desiredIndexNames.includes(x)
  );
  console.log(
    JSON.stringify(
      {
        existingIndexNames,
        indexNamesToAdd,
        indexNamesToRemove,
      },
      null,
      2
    )
  );

  for (const indexName of indexNamesToAdd) {
    createColumn(table4, indexName);
    //table4.createIndex(indexName, indexName);
  }
  for (const indexName of indexNamesToRemove) {
    //const isUnique = table4.index(indexName).unique
    //table4.deleteIndex(indexName);
    deleteColumn(table4, indexName);
  }

  //console.log("indexNames", indexNames);

  // Add a new index to the existing object store
  //table.createIndex("stuff", "stuff");
  //store.createIndex(...);
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
    const ind = table.createIndex(indexName, indexName, options);
    return ind;
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn("createIndex, error.name:", error.name);
    } else {
      console.warn("createIndex, other error:", error);
    }
    //if (error instanceof DOMException && error.name === "ConstraintError") {
    //  //expected if index already exist
    //} else {
    //  console.warn("createIndex, error:", error);
    //}
  }
}

function deleteColumn(table: IDBObjectStore, indexName: string) {
  try {
    table.deleteIndex(indexName);
  } catch (error) {
    console.warn("deleteIndex, error:", error);
  }
}

async function push_table4_synchronous() {
  const TABLE_NAME = "table4";

  createTable(TABLE_NAME, { keyPath: "id", autoIncrement: true });
  //createColumn("welpor", "somecol");
  //createColumn(TABLE_NAME, "someuniquecol", {unique: true})

  //potentially add additional indexes
  //table.createIndex("myotherindexedprop", "myotherindexedprop", { unique: false });

  //and possibly constraints (unique)
  //https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex#parameters
  //table.createIndex("email", "email", { unique: true });
}

async function push_table4_synchronous_welp() {
  const TABLE_NAME = "table4";

  //this is the same as table2 except when adding objects the id prop is optional
  //eg BOTH {id:"yep", hello: "world"} and  {hello: "world"} is fine
  //test this... how does it know if the id prop is string or number... or something else, when adding an object without id prop.
  //docs say it just ints, starting at 1, lets see if thats true
  //OK, TESTED. id is indeed a regular Number starting at 1

  if (db().objectStoreNames.contains(TABLE_NAME)) {
    console.log("early return. idb already has TABLE_NAME:", TABLE_NAME);
    return;
  }

  const table = db().createObjectStore(TABLE_NAME, {
    keyPath: "id",
    autoIncrement: true,
  });

  //potentially add additional indexes
  //table.createIndex("myotherindexedprop", "myotherindexedprop", { unique: false });

  //and possibly constraints (unique)
  //https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex#parameters
  //table.createIndex("email", "email", { unique: true });
}

//there are pretty much only 4 kinds of tables (aka object stores) available
//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#structuring_the_database

/*
async function push_table1(): Promise<void> {
  return new Promise((resolve, reject) => {
    //can hold any value but must manually supply key when adding values
    const table = db().createObjectStore("table1");

    table.transaction.onabort = () => reject();
    table.transaction.onerror = () => reject();
    table.transaction.oncomplete = () => resolve();

    //table.createIndex("name", "name", { unique: true });
  });
}

async function push_table2(): Promise<void> {
  return new Promise((resolve, reject) => {
    //can only hold objects that have a prop given by keyPath
    //eg {id:"yep", hello: "world"} is fine but {hello: "world"} is not
    const table = db().createObjectStore("table2", { keyPath: "id" });
    //table.createIndex("name", "name", { unique: true });

    table.transaction.onabort = () => reject();
    table.transaction.onerror = () => reject();
    table.transaction.oncomplete = () => resolve();
  });
}

async function push_table3(): Promise<void> {
  return new Promise((resolve, reject) => {
    //can hold any value
    //unclear what "key" it uses?.. test this.
    const table = db().createObjectStore("table3", { autoIncrement: true });
    //table.createIndex("name", "name", { unique: true });

    table.transaction.onabort = () => reject();
    table.transaction.onerror = () => reject();
    table.transaction.oncomplete = () => resolve();
  });
}
*/

/*
async function push_table4() {
  const TABLE_NAME = "table4";
  await new Promise<void>((resolve, reject) => {
    //this is the same as table2 except when adding objects the id prop is optional
    //eg BOTH {id:"yep", hello: "world"} and  {hello: "world"} is fine
    //test this... how does it know if the id prop is string or number... or something else, when adding an object without id prop.
    //docs say it just ints, starting at 1, lets see if thats true
    //OK, TESTED. id is indeed a regular Number starting at 1

    if (db().objectStoreNames.contains(TABLE_NAME)) {
      console.log("early return. idb already has TABLE_NAME:", TABLE_NAME);
      resolve();
    }

    const table = db().createObjectStore(TABLE_NAME, {
      keyPath: "id",
      autoIncrement: true,
    });
    //table.createIndex("name", "name", { unique: true });

    table.transaction.onabort = () => reject();
    table.transaction.onerror = () => reject();
    table.transaction.oncomplete = () => resolve();
  });
}
*/
