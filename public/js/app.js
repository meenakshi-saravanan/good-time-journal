document.addEventListener(
  "DOMContentLoaded",
  () => {

    const entriesContainer =
      document.getElementById("entries");

    if (entriesContainer) {
      loadEntries();
    }

    const entryForm =
      document.getElementById("entryForm");

    if (entryForm) {
      setDefaultEntryDate();

      entryForm.addEventListener(
        "submit",
        submitForm
      );
    }

    const newEntryButton =
      document.getElementById("newEntryButton");

    if (newEntryButton) {
      newEntryButton.addEventListener(
        "click",
        () => {
          window.location.href = "/new-entry.html";
        }
      );
    }

    const backButton =
      document.getElementById("backButton");

    if (backButton) {
      backButton.addEventListener(
        "click",
        () => {
          window.location.href = "/";
        }
      );
    }
  }
);

function setDefaultEntryDate() {

  document.getElementById(
    "entry_date"
  ).value =
    new Date()
      .toISOString()
      .split("T")[0];
}

async function loadEntries() {

  const entries =
    await fetchEntries();

  renderEntries(entries);
}

async function submitForm(event) {

  event.preventDefault();

  const entry = {
    entry_date:
      document.getElementById("entry_date").value,

    activity:
      document.getElementById("activity").value,

    energy:
      Number(
        document.getElementById("energy").value
      ),

    engagement:
      Number(
        document.getElementById("engagement").value
      ),

    notes:
      document.getElementById("notes").value
  };

  await saveEntry(entry);

  document
    .getElementById("entryForm")
    .reset();

  setDefaultEntryDate();
  window.location.href = "/";
}

async function removeEntry(id) {

  const confirmed =
    confirm(
      "Delete this entry?"
    );

  if (!confirmed) return;

  await deleteEntry(id);

  loadEntries();
}
