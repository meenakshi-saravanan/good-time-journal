document.addEventListener(
  "DOMContentLoaded",
  () => {

    document.getElementById(
      "entry_date"
    ).value =
      new Date()
        .toISOString()
        .split("T")[0];

    loadEntries();

    document
      .getElementById("entryForm")
      .addEventListener(
        "submit",
        submitForm
      );
  }
);

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

    description:
      document.getElementById("description").value,

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

  document.getElementById(
    "entry_date"
  ).value =
    new Date()
      .toISOString()
      .split("T")[0];

  loadEntries();
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