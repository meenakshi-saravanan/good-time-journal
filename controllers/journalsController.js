const db = require("../database/db");

const GOOD_TIME_TEMPLATE = "good_time";
const GOOD_TIME_NAME = "Good Time Journal";
const STANDARD_TEMPLATE = "standard";

function ensureGoodTimeJournal(callback) {
  db.get(
    `SELECT
      id,
      name,
      template_type,
      created_at
    FROM journals
    WHERE name = ?
      AND template_type = ?
    ORDER BY created_at ASC
    LIMIT 1`,
    [GOOD_TIME_NAME, GOOD_TIME_TEMPLATE],
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
        GOOD_TIME_NAME,
        "#8B5CF6",
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
  journals.color,
  journals.template_type,
  journals.created_at,
  COUNT(journal_entries.id) AS entry_count
    FROM journals
    LEFT JOIN journal_entries
      ON journal_entries.journal_id = journals.id
    GROUP BY journals.id
    ORDER BY journals.created_at ASC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
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
  color,
  template_type,
  created_at
    FROM journals
    WHERE id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        console.error(err);
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

function createJournalRecord(
  name,
  color,
  templateType,
  callback)  {
  db.run(
    `INSERT INTO journals (
  name,
  color,
  template_type
) VALUES (?, ?, ?)`,
    [name, color, templateType],
    function handleInsert(err) {
      if (err) {
        callback(err);
        return;
      }

      db.get(
        `SELECT
  id,
  name,
  color,
  template_type,
  created_at
        FROM journals
        WHERE id = ?`,
        [this.lastID],
        callback
      );
    }
  );
}

function createJournal(req, res) {
 const {
  name,
  color = "#8B5CF6"
} = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: "Journal name is required." });
    return;
  }

  createJournalRecord(
  name.trim(),
  color,
  STANDARD_TEMPLATE,
  (err, journal) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to create journal." });
        return;
      }

      res.status(201).json(journal);
    }
  );
}

function createFromTemplate(req, res) {
const {
  name,
  color = "#8B5CF6",
  template_type
} = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: "Journal name is required." });
    return;
  }

  if (template_type !== GOOD_TIME_TEMPLATE) {
    res.status(400).json({ error: "Template is not available yet." });
    return;
  }

  createJournalRecord(
  name.trim(),
  color,
  GOOD_TIME_TEMPLATE,
  (err, journal) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to create journal." });
        return;
      }

      res.status(201).json(journal);
    }
  );
}

function migrateGoodTimeJournal(req, res) {
  ensureGoodTimeJournal((err, journal) => {
    if (err) {
      console.error(err);
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
