//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

let db: IDBDatabase | undefined;

export async function openIndexedDB(
  name = "MyTestDatabase",
  version = 3
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onerror = () => {
      //console.error("Why didn't you allow my web app to use IndexedDB?!");
      reject();
    };
    request.onsuccess = (event) => {
      const meDatabase = (<IDBOpenDBRequest>event.target).result;
      console.log("onsuccess triggered");
      //resolve(event.target.result);
      resolve(meDatabase);
    };

    request.onupgradeneeded = (event) => {
      console.log("onupgradeneeded triggered");
      // Save the IDBDatabase interface
      const db = (<IDBOpenDBRequest>event.target).result;

      // Create an objectStore for this database

      const objectStoreBodyPart = db.createObjectStore("bodypart", {
        keyPath: "name",
      });
      objectStoreBodyPart.createIndex("name", "name", { unique: true });

      // Use transaction oncomplete to make sure the objectStore creation is
      // finished before adding data into it.
      objectStoreBodyPart.transaction.oncomplete = () => {
        console.log("objectStore.transaction.oncomplete triggered");
        // Store values in the newly created objectStore.
      };
    };
  });
}

const stuff = [
  { name: "Bill", age: 359, email: "bill@company.com" },
  { name: "Donna", age: 32, email: "donna@home.org" },
];
type X = {
  name: string;
} & Record<string, unknown>;

export async function getItem(key: string) {
  const storeName = "bodypart";
  return new Promise((resolve, reject) => {
    if (db) {
      const store = db
        .transaction("bodypart", "readwrite")
        .objectStore(storeName);

      const req = store.get(key);
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
export const idb = {
  getItem,
  setItem,
};

export async function setup() {
  db = await openIndexedDB();

  db.onerror = (event) => {
    // Generic error handler for all errors targeted at this database's
    // requests!
    console.error(`Database error: ${event.target.error?.message}`);
  };

  const transaction = db.transaction("bodypart", "readwrite");

  /*
  transaction.oncomplete = (event) => {
    console.log("transaction.oncomplete triggered");
    //console.log(event.)
  };

  transaction.onerror = (event) => {
    console.log("transaction.onerror triggered");
    // Don't forget to handle errors!
  };
  */

  /*
  const bodypartStore = transaction.objectStore("bodypart");

  for (const x of stuff) {
    //const req = bodypartStore.add(x);
    const req = bodypartStore.put(x);
    req.onsuccess = (event) => {
      console.log("add onsuccess, result:", event.target.result);
    };
    req.onerror = (event) => {
      console.log("add onerror, result:", event.target.error?.message);
    };
  }

  for (const x of stuff) {
    const req = bodypartStore.get(x.name);
    req.onsuccess = (event) => {
      console.log("get onsuccess, result:", event.target.result);
    };
    req.onerror = (event) => {
      console.log("get onerror, result:", event.target.result);
    };
  }
  */
}
