import type { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";

// Types
export type ResultType = {
  id: number;
  score: number;
  date: string;
};

// Mobile (SQLite) implementation
let db: SQLiteDatabase | null = null;

if (Platform.OS !== "web") {
  const { openDatabaseAsync } = require("expo-sqlite");

  (async () => {
    try {
      db = await openDatabaseAsync("sle.db");
      await initDatabase();
    } catch (e) {
      console.error("Database initialization error", e);
    }
  })();
}

async function initDatabase() {
  if (!db) return;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score INTEGER NOT NULL,
      date TEXT NOT NULL
    );
  `);
  console.log("Database initialized");
}

// Web (IndexedDB) implementation
const WEB_DB_NAME = "sle-web-db";
const WEB_STORE_NAME = "results";
let webDb: IDBDatabase | null = null;

if (Platform.OS === "web") {
  (async () => {
    try {
      webDb = await initWebDatabase();
      console.log("Web database initialized");
    } catch (e) {
      console.error("Web database initialization error", e);
    }
  })();
}

function initWebDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(WEB_DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(WEB_STORE_NAME)) {
        db.createObjectStore(WEB_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// Common database operations
export async function saveResultToDB(score: number, date: Date): Promise<void> {
  const record = {
    score,
    date: date.toISOString(),
  };

  if (Platform.OS === "web") {
    if (!webDb) {
      console.warn("Web database not initialized");
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = webDb!.transaction(WEB_STORE_NAME, "readwrite");
      const store = transaction.objectStore(WEB_STORE_NAME);
      const request = store.add(record);

      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error saving to web database", event);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  if (!db) {
    console.warn("Mobile database not initialized");
    return;
  }

  try {
    await db.runAsync("INSERT INTO results (score, date) VALUES (?, ?)", [
      record.score,
      record.date,
    ]);
  } catch (e) {
    console.error("Error saving to mobile database", e);
    throw e;
  }
}

export async function fetchHistoryFromDB(): Promise<ResultType[]> {
  if (Platform.OS === "web") {
    if (!webDb) {
      console.warn("Web database not initialized");
      return [];
    }

    return new Promise((resolve) => {
      const transaction = webDb!.transaction(WEB_STORE_NAME, "readonly");
      const store = transaction.objectStore(WEB_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(
          request.result.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      };

      request.onerror = (event) => {
        console.error("Error fetching from web database", event);
        resolve([]);
      };
    });
  }

  if (!db) {
    console.warn("Mobile database not initialized");
    return [];
  }

  try {
    return await db.getAllAsync<ResultType>(
      "SELECT * FROM results ORDER BY date DESC"
    );
  } catch (e) {
    console.error("Error fetching from mobile database", e);
    return [];
  }
}
