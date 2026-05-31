function renderEntries(entries) {

  const container =
    document.getElementById("entries");

  container.innerHTML = "";

  if (entries.length === 0) {
    container.innerHTML = `
      <p class="empty-state mb-0">
        No journal entries yet.
      </p>
    `;
    return;
  }

  entries.forEach((entry) => {

    const card =
      document.createElement("div");

    card.className = "card mb-3";

    card.innerHTML = `
      <div class="card-body">
      <h3 class="card-title h5">${entry.activity}</h3>

      <p class="card-text mb-2">
        <strong>Date:</strong>
        ${entry.entry_date}
      </p>

      <p class="card-text mb-2">
        <strong>Energy:</strong>
        ${entry.energy}/5
      </p>

      <p class="card-text mb-2">
        <strong>Engagement:</strong>
        ${entry.engagement}/5
      </p>

      <p class="card-text">
        <strong>Notes:</strong>
        ${entry.notes || ""}
      </p>

      <button
        type="button"
        class="btn btn-danger"
        onclick="removeEntry(${entry.id})"
      >
        Delete
      </button>
      </div>
    `;

    container.appendChild(card);

  });
}
