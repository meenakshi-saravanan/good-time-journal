CREATE TABLE IF NOT EXISTS journal_entries (

 id INTEGER PRIMARY KEY AUTOINCREMENT,

 entry_date TEXT NOT NULL,

 activity TEXT NOT NULL,

 description TEXT,

 energy INTEGER,

 engagement INTEGER,

 notes TEXT,

 created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);