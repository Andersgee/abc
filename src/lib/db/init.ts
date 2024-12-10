import { handlUpgradeNeeded } from "./schema";

export async function initIndexedDB(name = "abc", version = 1): Promise<void> {
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
