import {Database} from "bun:sqlite";

// TODO: Initialize a better-sqlite3 database connection.
export function createDbConnection(dbPath: string = ":memory:") {
  const db = new Database(dbPath);
  
  // TODO: Run a migration to create the `todos` table if it does not exist.
  // The table should have:
  // - id TEXT PRIMARY KEY
  // - title TEXT NOT NULL
  // - completed INTEGER DEFAULT 0
     db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);   

  return db;
}
