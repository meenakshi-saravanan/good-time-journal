const db = require("../database/db");

function getEntries(req, res) {
  const { journal_id } = req.query;
  const params = [req.session.userId];
  let journalFilter = "";

  if (journal_id) {
    journalFilter = "AND journal_id = ?";
    params.push(journal_id);
  }

  db.all(
    `SELECT
      id,
      journal_id,
      title,
      content,
      entry_date,
      activity,
      energy,
      engagement,
      notes,
      created_at
    FROM journal_entries
    WHERE user_id = ?
      ${journalFilter}
    ORDER BY entry_date DESC, created_at DESC`,
    params,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Unable to fetch journal entries." });
        return;
      }

      res.json(rows);
    }
  );
}

function getEntry(req, res) {
  db.get(
    `SELECT
      id,
      journal_id,
      title,
      content,
      entry_date,
      activity,
      energy,
      engagement,
      notes,
      created_at
    FROM journal_entries
    WHERE id = ?
      AND user_id = ?`,
    [req.params.id, req.session.userId],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: "Unable to fetch journal entry." });
        return;
      }

      if (!row) {
        res.status(404).json({ error: "Journal entry not found." });
        return;
      }

      res.json(row);
    }
  );
}

function createEntry(req, res) {
  const {
    journal_id,
    title,
    content,
    entry_date,
    activity,
    energy,
    engagement,
    notes = ""
  } = req.body;

  if (!journal_id) {
    res.status(400).json({ error: "Journal is required." });
    return;
  }

  db.get(
    `SELECT
      id,
      template_type
    FROM journals
    WHERE id = ?
      AND user_id = ?`,
    [journal_id, req.session.userId],
    (journalErr, journal) => {
      if (journalErr) {
        res.status(500).json({ error: "Unable to save journal entry." });
        return;
      }

      if (!journal) {
        res.status(404).json({ error: "Journal not found." });
        return;
      }

      const isGoodTimeJournal =
        journal.template_type === "good_time";

      if (
        isGoodTimeJournal &&
        (!entry_date || !activity || !energy || !engagement)
      ) {
        res.status(400).json({
          error: "Date, activity, energy, and engagement are required."
        });
        return;
      }

      if (!isGoodTimeJournal && (!title || !content)) {
        res.status(400).json({
          error: "Title and content are required."
        });
        return;
      }

      const entryDate =
        entry_date || new Date().toISOString().split("T")[0];

      const entryActivity =
        activity || title;

      const entryNotes =
        notes || content || "";

      db.run(
        `INSERT INTO journal_entries (
          user_id,
          journal_id,
          title,
          content,
          entry_date,
          activity,
          energy,
          engagement,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.session.userId,
          journal_id,
          title || null,
          content || null,
          entryDate,
          entryActivity,
          energy || null,
          engagement || null,
          entryNotes
        ],
        function handleInsert(err) {
          if (err) {
            res.status(500).json({ error: "Unable to save journal entry." });
            return;
          }

          res.status(201).json({
            id: this.lastID,
            user_id: req.session.userId,
            journal_id,
            title: title || null,
            content: content || null,
            entry_date: entryDate,
            activity: entryActivity,
            energy: energy || null,
            engagement: engagement || null,
            notes: entryNotes
          });
        }
      );
    }
  );
}

function deleteEntry(req, res) {
  db.run(
    `DELETE FROM journal_entries
    WHERE id = ?
      AND user_id = ?`,
    [req.params.id, req.session.userId],
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
  getEntry,
  createEntry,
  deleteEntry
};
