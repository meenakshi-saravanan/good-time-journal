const db = require("../database/db");

const GOOD_TIME_TEMPLATE = "good_time";
const GOOD_TIME_NAME = "Good Time Journal";
const STANDARD_TEMPLATE = "standard";

function ensureGoodTimeJournal(userId, callback) {
  db.get(
    `SELECT
      id,
      user_id,
      name,
      template_type,
      created_at
    FROM journals
    WHERE user_id = ?
      AND name = ?
      AND template_type = ?
    ORDER BY created_at ASC
    LIMIT 1`,
    [userId, GOOD_TIME_NAME, GOOD_TIME_TEMPLATE],
    (findErr, existingJournal) => {
      if (findErr) {
        callback(findErr);
        return;
      }

      if (existingJournal) {
        callback(null, existingJournal);
        return;
      }

      createJournalRecord(
        userId,
        GOOD_TIME_NAME,
        GOOD_TIME_TEMPLATE,
        callback
      );
    }
  );
}

function getJournals(req, res) {
  db.all(
    `SELECT
      journals.id,
      journals.name,
      journals.template_type,
      journals.created_at,
      COUNT(journal_entries.id) AS entry_count
    FROM journals
    LEFT JOIN journal_entries
      ON journal_entries.journal_id = journals.id
      AND journal_entries.user_id = journals.user_id
    WHERE journals.user_id = ?
    GROUP BY journals.id
    ORDER BY journals.created_at ASC`,
    [req.session.userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Unable to fetch journals." });
        return;
      }

      res.json(rows);
    }
  );
}

function getJournal(req, res) {
  db.get(
    `SELECT
      id,
      name,
      template_type,
      created_at
    FROM journals
    WHERE id = ?
      AND user_id = ?`,
    [req.params.id, req.session.userId],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: "Unable to fetch journal." });
        return;
      }

      if (!row) {
        res.status(404).json({ error: "Journal not found." });
        return;
      }

      res.json(row);
    }
  );
}

function createJournalRecord(userId, name, templateType, callback) {
  db.run(
    `INSERT INTO journals (
      user_id,
      name,
      template_type
    ) VALUES (?, ?, ?)`,
    [userId, name, templateType],
    function handleInsert(err) {
      if (err) {
        callback(err);
        return;
      }

      db.get(
        `SELECT
          id,
          user_id,
          name,
          template_type,
          created_at
        FROM journals
        WHERE id = ?
          AND user_id = ?`,
        [this.lastID, userId],
        callback
      );
    }
  );
}

function createJournal(req, res) {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: "Journal name is required." });
    return;
  }

  createJournalRecord(
    req.session.userId,
    name.trim(),
    STANDARD_TEMPLATE,
    (err, journal) => {
      if (err) {
        res.status(500).json({ error: "Unable to create journal." });
        return;
      }

      res.status(201).json(journal);
    }
  );
}

function createFromTemplate(req, res) {
  const { name, template_type } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: "Journal name is required." });
    return;
  }

  if (template_type !== GOOD_TIME_TEMPLATE) {
    res.status(400).json({ error: "Template is not available yet." });
    return;
  }

  createJournalRecord(
    req.session.userId,
    name.trim(),
    GOOD_TIME_TEMPLATE,
    (err, journal) => {
      if (err) {
        res.status(500).json({ error: "Unable to create journal." });
        return;
      }

      res.status(201).json(journal);
    }
  );
}

function migrateGoodTimeJournal(req, res) {
  ensureGoodTimeJournal(req.session.userId, (err, journal) => {
    if (err) {
      res.status(500).json({ error: "Unable to create journal." });
      return;
    }

    res.status(201).json(journal);
  });
}

module.exports = {
  getJournals,
  getJournal,
  createJournal,
  createFromTemplate,
  migrateGoodTimeJournal,
  ensureGoodTimeJournal
};
