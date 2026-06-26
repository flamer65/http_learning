import Database from "better-sqlite3";

export function createDbConnection(dbPath: string = ":memory:") {
  const db = new Database(dbPath);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);

  return db;
}
