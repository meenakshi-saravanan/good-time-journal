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

  container.innerHTML = `
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
  `;

  const rows =
    document.getElementById("entryRows");

  entries.forEach((entry) => {

    const row =
      document.createElement("tr");

    row.innerHTML = `
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
    `;

    rows.appendChild(row);

  });
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

  document.getElementById("entryDetail").innerHTML = `
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
          <dd class="col-sm-9">
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
