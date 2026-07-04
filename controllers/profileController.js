const db = require("../database/db");

const LOCAL_PROFILE_ID = 1;
const STARTER_JOURNAL_NAME = "Journal";
const STARTER_TEMPLATE = "standard";
const WELCOME_ENTRY_TITLE = "Getting Started";
const WELCOME_ENTRY_CONTENT = `
  <h2>Getting Started</h2>
  <p>This is your private writing space. Capture ideas, reflections, plans, and memories here.</p>
  <p>Create a new entry whenever you are ready to write.</p>
`;

function getProfile(req, res) {
  db.get(
    `SELECT
      display_name,
      created_at
    FROM profile
    WHERE id = ?`,
    [LOCAL_PROFILE_ID],
    (err, profile) => {
      if (err) {
        res.status(500).json({ error: "Unable to load profile." });
        return;
      }

      if (!profile) {
        res.status(404).json({ error: "Profile not found." });
        return;
      }

      res.json(profile);
    }
  );
}

function createProfile(req, res) {
  const displayName =
    String(req.body.display_name || "").trim();

  if (!displayName || displayName.length > 40) {
    res.status(400).json({
      error: "Display name is required and must be 40 characters or fewer."
    });
    return;
  }

  db.serialize(() => {
    db.run(
      `INSERT INTO profile (
        id,
        display_name
      ) VALUES (?, ?)`,
      [LOCAL_PROFILE_ID, displayName],
      function handleProfileInsert(profileErr) {
        if (profileErr) {
          if (profileErr.message.includes("UNIQUE")) {
            res.status(409).json({ error: "Profile already exists." });
            return;
          }

          res.status(500).json({ error: "Unable to create your profile." });
          return;
        }

        createStarterContent((starterErr) => {
          if (starterErr) {
            res.status(500).json({ error: "Unable to create starter content." });
            return;
          }

          res.status(201).json({ success: true });
        });
      }
    );
  });
}

function createStarterContent(callback) {
  db.get(
    `SELECT id
    FROM journals
    WHERE name = ?
    LIMIT 1`,
    [STARTER_JOURNAL_NAME],
    (journalFindErr, existingJournal) => {
      if (journalFindErr) {
        callback(journalFindErr);
        return;
      }

      if (existingJournal) {
        ensureWelcomeEntry(existingJournal.id, callback);
        return;
      }

      db.run(
        `INSERT INTO journals (
          name,
          color,
          template_type
        ) VALUES (?, ?, ?)`,
        [STARTER_JOURNAL_NAME, "#8B5CF6", STARTER_TEMPLATE],
        function handleJournalInsert(journalInsertErr) {
          if (journalInsertErr) {
            callback(journalInsertErr);
            return;
          }

          ensureWelcomeEntry(this.lastID, callback);
        }
      );
    }
  );
}

function ensureWelcomeEntry(journalId, callback) {
  db.get(
    `SELECT id
    FROM journal_entries
    WHERE journal_id = ?
      AND title = ?
    LIMIT 1`,
    [journalId, WELCOME_ENTRY_TITLE],
    (entryFindErr, existingEntry) => {
      if (entryFindErr) {
        callback(entryFindErr);
        return;
      }

      if (existingEntry) {
        callback(null);
        return;
      }

      const today =
        new Date().toISOString().split("T")[0];

      db.run(
        `INSERT INTO journal_entries (
          journal_id,
          title,
          preview,
          content,
          entry_date,
          activity,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          journalId,
          WELCOME_ENTRY_TITLE,
          "This is your private writing space.",
          WELCOME_ENTRY_CONTENT.trim(),
          today,
          WELCOME_ENTRY_TITLE,
          WELCOME_ENTRY_CONTENT.trim()
        ],
        callback
      );
    }
  );
}

module.exports = {
  getProfile,
  createProfile,
  LOCAL_PROFILE_ID
};

