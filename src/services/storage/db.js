import { openDB } from "idb";
import { DB_NAME, DB_VERSION, NODES_STORE } from "@shared/constants";

let dbPromise = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(NODES_STORE, { keyPath: "id" });
        store.createIndex("by-parent", "parentId");
        store.createIndex("by-name", "name");
      },
    });
  }
  return dbPromise;
}
