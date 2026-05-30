function renderEntries(entries) {

  const container =
    document.getElementById("entries");

  container.innerHTML = "";

  entries.forEach((entry) => {

    const card =
      document.createElement("div");

    card.className = "entry-card";

    card.innerHTML = `
      <h3>${entry.activity}</h3>

      <p>
        <strong>Date:</strong>
        ${entry.entry_date}
      </p>

      <p>
        <strong>Description:</strong>
        ${entry.description || ""}
      </p>

      <p>
        <strong>Energy:</strong>
        ${entry.energy}/5
      </p>

      <p>
        <strong>Engagement:</strong>
        ${entry.engagement}/5
      </p>

      <p>
        <strong>Notes:</strong>
        ${entry.notes || ""}
      </p>

      <button
        class="delete-btn"
        onclick="removeEntry(${entry.id})"
      >
        Delete
      </button>
    `;

    container.appendChild(card);

  });
}