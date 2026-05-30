const db = require("../database/db");

function getEntries(req, res) {
  db.all(
    `SELECT
      id,
      entry_date,
      activity,
      description,
      energy,
      engagement,
      notes,
      created_at
    FROM journal_entries
    ORDER BY entry_date DESC, created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Unable to fetch journal entries." });
        return;
      }

      res.json(rows);
    }
  );
}

function createEntry(req, res) {
  const {
    entry_date,
    activity,
    description = "",
    energy,
    engagement,
    notes = ""
  } = req.body;

  if (!entry_date || !activity || !energy || !engagement) {
    res.status(400).json({
      error: "Date, activity, energy, and engagement are required."
    });
    return;
  }

  db.run(
    `INSERT INTO journal_entries (
      entry_date,
      activity,
      description,
      energy,
      engagement,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [entry_date, activity, description, energy, engagement, notes],
    function handleInsert(err) {
      if (err) {
        res.status(500).json({ error: "Unable to save journal entry." });
        return;
      }

      res.status(201).json({
        id: this.lastID,
        entry_date,
        activity,
        description,
        energy,
        engagement,
        notes
      });
    }
  );
}

function deleteEntry(req, res) {
  db.run(
    "DELETE FROM journal_entries WHERE id = ?",
    [req.params.id],
    function handleDelete(err) {
      if (err) {
        res.status(500).json({ error: "Unable to delete journal entry." });
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: "Journal entry not found." });
        return;
      }

      res.status(204).send();
    }
  );
}

module.exports = {
  getEntries,
  createEntry,
  deleteEntry
};
