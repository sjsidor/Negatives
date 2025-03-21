import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize database
export const db = await open({
  filename: 'photos.db',
  driver: sqlite3.Database
});

// Create tables if they don't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date_taken TEXT,
    location TEXT,
    film_info TEXT,
    filename TEXT NOT NULL,
    image_url TEXT NOT NULL,
    upload_date TEXT DEFAULT CURRENT_TIMESTAMP
  )
`); 