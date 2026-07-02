const sqlite3 = require("sqlite3").verbose();

const path = require("path");

console.log("Current working directory:", process.cwd());
console.log("Database path:", path.resolve("./journal.db"));

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
    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      template_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
CREATE TABLE IF NOT EXISTS journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  journal_id INTEGER,
  title TEXT,
  preview TEXT,
  content TEXT,
  entry_date TEXT NOT NULL,
  activity TEXT NOT NULL,
  energy INTEGER,
  engagement INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(journal_id) REFERENCES journals(id)
)
  `);

  db.all("PRAGMA table_info(journal_entries)", (err, columns) => {
    if (err) {
      console.error(err.message);
      return;
    }

    ensureColumn(columns, "journal_entries", "journal_id", "INTEGER");
    ensureColumn(columns, "journal_entries", "title", "TEXT");
    ensureColumn(columns, "journal_entries", "preview", "TEXT");
    ensureColumn(columns, "journal_entries", "content", "TEXT");
  ensureColumn(
  columns,
  "journal_entries",
  "updated_at",
  "DATETIME"
);
  });


  db.all("PRAGMA index_list(journals)", (err, indexes) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const hasTemplateUniqueIndex =
      indexes.some((index) => index.unique && index.origin === "u");

    if (!hasTemplateUniqueIndex) {
      return;
    }

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS journals_next (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          template_type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        )
      `);

      db.run(`
        INSERT OR IGNORE INTO journals_next (
          id,
          user_id,
          name,
          template_type,
          created_at
        )
        SELECT
          id,
          user_id,
          name,
          template_type,
          created_at
        FROM journals
      `);

      db.run("DROP TABLE journals");
      db.run("ALTER TABLE journals_next RENAME TO journals");
    });
  });

  db.all(
    `SELECT DISTINCT user_id AS id
    FROM journal_entries
    WHERE user_id IS NOT NULL
      AND journal_id IS NULL`,
    (err, users) => {
    if (err) {
      console.error(err.message);
      return;
    }

    users.forEach((user) => {
      db.run(
        `INSERT OR IGNORE INTO journals (
          user_id,
          name,
          template_type
        ) VALUES (?, ?, ?)`,
        [user.id, "Good Time Journal", "good_time"],
        (insertErr) => {
          if (insertErr) {
            console.error(insertErr.message);
            return;
          }

          db.get(
            `SELECT id
            FROM journals
            WHERE user_id = ?
              AND template_type = ?`,
            [user.id, "good_time"],
            (journalErr, journal) => {
              if (journalErr) {
                console.error(journalErr.message);
                return;
              }

              if (!journal) {
                return;
              }

              db.run(
                `UPDATE journal_entries
                SET journal_id = ?
                WHERE user_id = ?
                  AND journal_id IS NULL`,
                [journal.id, user.id],
                (updateErr) => {
                  if (updateErr) {
                    console.error(updateErr.message);
                  }
                }
              );
            }
          );
        }
      );
    });
    }
  );
});

function ensureColumn(columns, tableName, columnName, definition) {
  const hasColumn =
    columns.some((column) => column.name === columnName);

  if (hasColumn) {
    return;
  }

  db.run(
    `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
}

module.exports = db;
