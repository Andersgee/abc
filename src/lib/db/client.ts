export function db() {
  if (!window.db) throw new Error("no window.db");
  return window.db;
}
/*
export async function getItem(key: string) {
  const storeName = "bodypart";
  return new Promise((resolve, reject) => {
    
      const store = db()
        .transaction("bodypart", "readwrite")
        .objectStore(storeName);

      const req = store.get(key);
      req.onsuccess = (event) => {
        resolve(event.target.result);
      };
      req.onerror = (event) => {
        reject(event.target.error?.message);
      };
    }
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
*/
