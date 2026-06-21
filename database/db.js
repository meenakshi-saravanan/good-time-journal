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
      content TEXT,
      entry_date TEXT NOT NULL,
      activity TEXT NOT NULL,
      energy INTEGER,
      engagement INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(journal_id) REFERENCES journals(id)
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

    const hasJournalId =
      columns.some((column) => column.name === "journal_id");

    if (!hasJournalId) {
      db.run(
        "ALTER TABLE journal_entries ADD COLUMN journal_id INTEGER",
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          }
        }
      );
    }

    const hasTitle =
      columns.some((column) => column.name === "title");

    if (!hasTitle) {
      db.run(
        "ALTER TABLE journal_entries ADD COLUMN title TEXT",
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          }
        }
      );
    }

    const hasContent =
      columns.some((column) => column.name === "content");

    if (!hasContent) {
      db.run(
        "ALTER TABLE journal_entries ADD COLUMN content TEXT",
        (alterErr) => {
          if (alterErr) {
            console.error(alterErr.message);
          }
        }
      );
    }
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

module.exports = db;
