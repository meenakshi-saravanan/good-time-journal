const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./journal.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      entry_date TEXT NOT NULL,
      activity TEXT NOT NULL,
      energy INTEGER,
      engagement INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.all("PRAGMA table_info(journal_entries)", (err, columns) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const hasUserId = columns.some((column) => column.name === "user_id");

    if (!hasUserId) {
      db.run(
        "ALTER TABLE journal_entries ADD COLUMN user_id INTEGER",
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          }
        }
      );
    }
  });
});

module.exports = db;
