import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Open and initialize the DB
export async function getDb() {
  const db = await open({
    filename: path.resolve("./backend/database.sqlite"),
    driver: sqlite3.Database,
  });

  // Ensure the employees table exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      position TEXT,
      salary DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}
