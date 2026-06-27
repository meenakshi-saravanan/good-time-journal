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

  const isGoodTimeJournal =
    !window.currentJournal ||
    window.currentJournal.template_type === "good_time";

  container.innerHTML =
    isGoodTimeJournal
      ? `
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Activity</th>
                <th scope="col">Energy</th>
                <th scope="col">Engagement</th>
                <th scope="col" class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody id="entryRows"></tbody>
          </table>
        </div>
      `
      : `
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Title</th>
                <th scope="col" class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody id="entryRows"></tbody>
          </table>
        </div>
      `;

  const rows =
    document.getElementById("entryRows");

  entries.forEach((entry) => {

    const row =
      document.createElement("tr");

    row.innerHTML =
      isGoodTimeJournal
        ? `
          <td>${formatEntryDate(entry.entry_date)}</td>
          <td>${entry.activity}</td>
          <td>${renderStars(entry.energy)}</td>
          <td>${renderStars(entry.engagement)}</td>
          <td class="text-center">

  <a
    class="link-offset-2 link-underline link-underline-opacity-0 me-3"
    href="/journal-entry.html?id=${entry.id}"
  >
    View
  </a>

   <a
    href="#"
    class="link-danger link-offset-2 link-underline link-underline-opacity-0"
    onclick="event.preventDefault(); removeEntry(${entry.id})"
  >
    Delete
  </a>

</td>
        `
        : `
          <td>${formatEntryDate(entry.entry_date)}</td>
          <td>${entry.title || entry.activity}</td>
          <td class="text-center">
            <a
              class="link-offset-2 link-underline link-underline-opacity-0 me-3"
              href="/journal-entry.html?id=${entry.id}"
            >
              View
            </a>

            <a
              href="#"
              class="link-danger link-offset-2 link-underline link-underline-opacity-0"
              onclick="event.preventDefault(); removeEntry(${entry.id})"
            >
              Delete
            </a>
          </td>
        `;

    rows.appendChild(row);

  });
}

function renderJournals(journals) {
  const container =
    document.getElementById("journals");

  container.innerHTML = "";

  if (journals.length === 0) {
    container.innerHTML = `
      <p class="empty-state mb-0">
        No journals yet.
      </p>
    `;
    return;
  }

  const grid =
    document.createElement("div");

  grid.className = "row g-3";

  journals.forEach((journal) => {
    const column =
      document.createElement("div");

    column.className = "col-md-6 col-lg-4";

    column.innerHTML = `
      <a
        href="/journals/${journal.id}"
        class="journal-card card h-100 text-decoration-none text-body"
      >
        <div class="card-body">
          <h2 class="h5 card-title">
            ${journal.name}
          </h2>
          <p class="card-text text-secondary mb-0">
            ${journal.entry_count} Entries
          </p>
        </div>
      </a>
    `;

    grid.appendChild(column);
  });

  container.appendChild(grid);
}
function renderJournalSidebar(journals) {

  const container =
    document.getElementById("journalList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  journals.forEach((journal) => {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className =
      "sidebar-item";

    button.dataset.journalId =
      journal.id;

    button.innerHTML = `
      <i class="bi bi-journal-text"></i>
      <span>${journal.name}</span>
    `;

    if (
      appState.selectedJournalId === journal.id
    ) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {

      selectJournal(journal.id);

    });

    container.appendChild(button);

  });
  const allEntriesButton =
    document.getElementById("allEntriesButton");

  if (allEntriesButton) {

    allEntriesButton.onclick = () => {

      selectJournal("all");

    };

  }


}

function renderTemplates() {
  const container =
    document.getElementById("templates");

  container.innerHTML = `
    <div class="row g-3">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5 card-title">
              Good Time Journal
            </h2>
            <p class="card-text text-secondary">
              Track activities that energize you
              and identify patterns over time.
            </p>
            <div class="mb-3">
              <label
                for="templateJournalName"
                class="form-label"
              >
                Journal Name
              </label>
              <input
                type="text"
                id="templateJournalName"
                class="form-control"
                placeholder="My Good Times"
              >
            </div>
            <button
              type="button"
              id="useGoodTimeTemplateButton"
              class="btn btn-primary btn-sm"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100 template-coming-soon">
          <div class="card-body">
            <span class="badge text-bg-secondary mb-3">
              Coming Soon
            </span>
            <h2 class="h5 card-title">
              Daily Reflection
            </h2>
            <p class="card-text text-secondary">
              Build a daily reflection habit.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100 template-coming-soon">
          <div class="card-body">
            <span class="badge text-bg-secondary mb-3">
              Coming Soon
            </span>
            <h2 class="h5 card-title">
              Gratitude Journal
            </h2>
            <p class="card-text text-secondary">
              Notice and revisit what you are grateful for.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100 template-coming-soon">
          <div class="card-body">
            <span class="badge text-bg-secondary mb-3">
              Coming Soon
            </span>
            <h2 class="h5 card-title">
              Travel Journal
            </h2>
            <p class="card-text text-secondary">
              Save memories from trips and places.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStars(value) {
  let stars = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      stars += '<i class="bi bi-star-fill text-warning"></i>';
    } else {
      stars += '<i class="bi bi-star text-secondary"></i>';
    }
  }

  return stars;
}
function renderEntryDetail(entry) {
  window.currentJournalId = entry.journal_id;

  const backLink =
    document.getElementById("entryBackLink");

  if (backLink && entry.journal_id) {
    backLink.href = `/journals/${entry.journal_id}`;
  }

  const isStandardEntry =
    entry.title || entry.content;

  document.getElementById("entryDetail").innerHTML =
    isStandardEntry
      ? `
    <div class="card">
      <div class="card-body">

        <h2 class="card-title h3 mb-4">
          ${entry.title || entry.activity}
        </h2>

        <dl class="row mb-0">
          <dt class="col-sm-3">Date</dt>
          <dd class="col-sm-9">
            ${formatEntryDate(entry.entry_date)}
          </dd>

          <dt class="col-sm-3">Content</dt>
          <dd class="col-sm-9 entry-rich-text">
            ${entry.content || entry.notes || ""}
          </dd>
        </dl>

        <div id="deleteError"></div>

        <div class="mt-4">
          <button
            class="btn btn-danger"
            onclick="removeEntry(${entry.id})"
          >
            Delete Entry
          </button>
        </div>

      </div>
    </div>
  `
      : `
    <div class="card">
      <div class="card-body">

        <h2 class="card-title h3 mb-4">
          ${entry.activity}
        </h2>

        <dl class="row mb-0">

          <dt class="col-sm-3">Date</dt>
          <dd class="col-sm-9">
            ${formatEntryDate(entry.entry_date)}
          </dd>

          <dt class="col-sm-3">Energy</dt>
          <dd class="col-sm-9">
            ${entry.energy}/5
          </dd>

          <dt class="col-sm-3">Engagement</dt>
          <dd class="col-sm-9">
            ${entry.engagement}/5
          </dd>

          <dt class="col-sm-3">Notes</dt>
          <dd class="col-sm-9 entry-rich-text">
            ${entry.notes || ""}
          </dd>

        </dl>

        <div id="deleteError"></div>

        <div class="mt-4">
          <button
            class="btn btn-danger"
            onclick="removeEntry(${entry.id})"
          >
            Delete Entry
          </button>
        </div>

      </div>
    </div>
  `;
}

function renderEntryDetailError() {

  document.getElementById("entryDetail").innerHTML = `
    <div class="alert alert-warning" role="alert">
      Journal entry could not be found.
    </div>
  `;
}

function formatEntryDate(dateValue) {

  return new Date(`${dateValue}T00:00:00`)
    .toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
}

function formatEntryTime(date) {

  if (!date) {
    return "";
  }

  return new Date(date)
    .toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

}
function truncatePreview(text) {

  if (!text) {
    return "";
  }

  if (text.length <= 120) {
    return text;
  }

  return text.substring(0, 120) + "...";

}

function renderEntryList(entries) {

  const container =
    document.getElementById("entryList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (entries.length === 0) {

    container.innerHTML = `
            <div class="text-muted p-4">
                No entries found.
            </div>
        `;

    return;

  }

  entries.forEach((entry) => {

    const item =
      document.createElement("div");

    item.className =
      "entry-list-item";

    // Highlight selected entry
    if (appState.selectedEntryId === entry.id) {
      item.classList.add("selected");
    }

    item.innerHTML = `
            <div class="entry-card-top">
                <div class="entry-list-title">
                    ${entry.title || "Untitled"}
                </div>
                <div class="entry-list-time">
                    ${formatEntryTime(entry.updated_at)}
                </div>
            </div>
            <div class="entry-list-preview">
                ${truncatePreview(entry.preview)}
            </div>
        `;

    item.addEventListener("click", () => {
      selectEntry(entry.id);
    });

    container.appendChild(item);

  });

}
