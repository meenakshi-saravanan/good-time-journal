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
  // Check if journals table exists and has user_id column
  db.all("PRAGMA table_info(journals)", (err, columns) => {
    if (err) {
      console.error("Error checking journals table info:", err.message);
      return;
    }

    const hasUserId = columns && columns.some((col) => col.name === "user_id");

    if (hasUserId) {
      console.log("Migration needed: user_id found in journals table.");

      db.serialize(() => {
        db.run("PRAGMA foreign_keys = OFF;");

        db.run(`CREATE TABLE IF NOT EXISTS journals_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          template_type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`INSERT INTO journals_new (id, name, template_type, created_at)
                SELECT id, name, template_type, created_at FROM journals`);

        db.run(`CREATE TABLE IF NOT EXISTS journal_entries_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          journal_id INTEGER NOT NULL,
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
          FOREIGN KEY(journal_id) REFERENCES journals(id) ON DELETE CASCADE
        )`);

        db.run(`INSERT INTO journal_entries_new (
                  id, journal_id, title, preview, content, entry_date,
                  activity, energy, engagement, notes, created_at, updated_at
                )
                SELECT
                  id, COALESCE(journal_id, 1), title, preview, content, entry_date,
                  activity, energy, engagement, notes, created_at, updated_at
                FROM journal_entries`);

        db.run("DROP TABLE journal_entries");
        db.run("DROP TABLE journals");
        db.run("DROP TABLE IF EXISTS users");

        db.run("ALTER TABLE journals_new RENAME TO journals");
        db.run("ALTER TABLE journal_entries_new RENAME TO journal_entries");

        db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
          if (pragmaErr) {
            console.error("Error enabling foreign keys:", pragmaErr.message);
          } else {
            console.log("Database migration complete.");
          }
          initializeNewSchema();
        });
      });
    } else {
      initializeNewSchema();
    }
  });
});

function initializeNewSchema() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        display_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS journals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        template_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        journal_id INTEGER NOT NULL,
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
        FOREIGN KEY(journal_id) REFERENCES journals(id) ON DELETE CASCADE
      )
    `);
  });
}

module.exports = db;

