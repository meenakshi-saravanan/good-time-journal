document.addEventListener(
  "DOMContentLoaded",
  async () => {
    const isAuthPage =
      document.body.dataset.page === "auth";

    if (isAuthPage) {
      setupAuthPage();
      return;
    }

    const user =
      await requireAuthenticatedUser();

    if (!user) {
      return;
    }

    renderAuthenticatedHeader(user);

    const journalsContainer =
      document.getElementById("journals");

    if (journalsContainer) {
      loadJournals();
    }

    const journalTitle =
      document.getElementById("journalTitle");

    if (journalTitle) {
      loadJournalPage();
    }

    const templatesContainer =
      document.getElementById("templates");

    if (templatesContainer) {
      setupTemplatesPage();
    }

    const journalForm =
      document.getElementById("journalForm");

    if (journalForm) {
      journalForm.addEventListener(
        "submit",
        submitJournalForm
      );
    }

    const entriesContainer =
      document.getElementById("entries");

    if (entriesContainer && !journalTitle) {
      loadEntries();
    }

    const entryForm =
      document.getElementById("entryForm");

    if (entryForm) {
      const journalId =
        getJournalIdFromUrl();

      if (!journalId) {
        window.location.href = "/";
        return;
      }

      await setupEntryForm(journalId);
      revealEntryForm();

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
          const journalId =
            getJournalIdFromUrl();

          const target =
            journalId
              ? `/new-entry.html?journal_id=${journalId}`
              : "/new-entry.html";

          window.location.href = target;
        }
      );
    }

    const backButton =
      document.getElementById("backButton");

    if (backButton) {
      backButton.addEventListener(
        "click",
        () => {
          const journalId =
            getJournalIdFromUrl();

          window.location.href =
            journalId ? `/journals/${journalId}` : "/";
        }
      );
    }

    const entryDetail =
      document.getElementById("entryDetail");

    if (entryDetail) {
      loadEntryDetail();
    }
  }
);

async function requireAuthenticatedUser() {
  try {
    return await getCurrentUser();
  } catch (error) {
    window.location.href = "/login.html";
    return null;
  }
}

function renderAuthenticatedHeader(user) {
  const userName =
    document.getElementById("userName");

  if (userName) {
    userName.textContent = `Welcome, ${user.name}`;
  }

  const logoutButton =
    document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await logoutUser();
      window.location.href = "/login.html";
    });
  }
}

async function setupAuthPage() {
  try {
    await getCurrentUser();
    window.location.href = "/";
    return;
  } catch (error) {
    // User is not authenticated yet.
  }

  const signupForm =
    document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", submitSignupForm);
  }

  const loginForm =
    document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", submitLoginForm);
  }
}

function setDefaultEntryDate() {

  document.getElementById(
    "entry_date"
  ).value =
    new Date()
      .toISOString()
      .split("T")[0];
}

async function setupEntryForm(journalId) {
  const journal =
    await fetchJournal(journalId);

  window.currentJournal = journal;

  const formTitle =
    document.getElementById("entryFormTitle");

  if (formTitle) {
    formTitle.textContent = `New Entry in ${journal.name}`;
  }

  const standardFields =
    document.getElementById("standardEntryFields");

  const goodTimeFields =
    document.getElementById("goodTimeEntryFields");

  const editorLabel =
    document.getElementById("editorLabel");

  if (journal.template_type === "good_time") {
    if (standardFields) {
      standardFields.classList.add("d-none");
    }

    if (goodTimeFields) {
      goodTimeFields.classList.remove("d-none");
    }

    setEntryFieldsEnabled("standardEntryFields", false);
    setEntryFieldsEnabled("goodTimeEntryFields", true);

    if (editorLabel) {
      editorLabel.textContent = "Journal Notes";
    }

    setDefaultEntryDate();
    return;
  }

  if (standardFields) {
    standardFields.classList.remove("d-none");
  }

  if (goodTimeFields) {
    goodTimeFields.classList.add("d-none");
  }

  setEntryFieldsEnabled("goodTimeEntryFields", false);
  setEntryFieldsEnabled("standardEntryFields", true);

  if (editorLabel) {
    editorLabel.textContent = "Content";
  }
}

function setEntryFieldsEnabled(containerId, enabled) {
  const container =
    document.getElementById(containerId);

  if (!container) {
    return;
  }

  container
    .querySelectorAll("input, textarea, select")
    .forEach((field) => {
      field.disabled = !enabled;

      if (
        field.id === "title" ||
        field.id === "content" ||
        field.id === "entry_date" ||
        field.id === "activity" ||
        field.id === "energy" ||
        field.id === "engagement"
      ) {
        field.required = enabled;
      }
    });
}

function revealEntryForm() {
  const loading =
    document.getElementById("entryLoading");

  if (loading) {
    loading.remove();
  }

  const entryForm =
    document.getElementById("entryForm");

  if (entryForm) {
    entryForm.classList.remove("d-none");
  }
}

async function loadEntries() {

  const entries =
    await fetchEntries();

  renderEntries(entries);
}

async function loadJournals() {
  const journals =
    await fetchJournals();

  renderJournals(journals);
}

async function loadJournalPage() {
  const journalId =
    getJournalIdFromUrl();

  if (!journalId) {
    window.location.href = "/";
    return;
  }

  try {
    const journal =
      await fetchJournal(journalId);

    window.currentJournal = journal;

    document.getElementById("journalTitle").textContent =
      journal.name;

    const entries =
      await fetchEntries();

    const entryCount =
      document.getElementById("journalEntryCount");

    if (entryCount) {
      entryCount.textContent =
        `${entries.length} ${entries.length === 1 ? "Entry" : "Entries"}`;
    }

    renderEntries(entries);
  } catch (error) {
    document.getElementById("entries").innerHTML = `
      <div class="alert alert-warning" role="alert">
        Journal could not be found.
      </div>
    `;
  }
}

function setupTemplatesPage() {
  renderTemplates();

  const useTemplateButton =
    document.getElementById("useGoodTimeTemplateButton");

  if (useTemplateButton) {
    useTemplateButton.addEventListener(
      "click",
      useGoodTimeTemplate
    );
  }
}

async function loadEntryDetail() {

  const params =
    new URLSearchParams(window.location.search);

  const id =
    params.get("id");

  if (!id) {
    renderEntryDetailError();
    return;
  }

  try {
    const entry =
      await fetchEntry(id);

    renderEntryDetail(entry);
  } catch (error) {
    renderEntryDetailError();
  }
}

async function submitForm(event) {

  event.preventDefault();

  const journalId =
    getJournalIdFromUrl();

  const isGoodTimeJournal =
    window.currentJournal &&
    window.currentJournal.template_type === "good_time";

  const entry =
    isGoodTimeJournal
      ? {
        journal_id: journalId,

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
          getNotesEditorHtml()
      }
      : {
        journal_id: journalId,
        title:
          document.getElementById("title").value,
        content:
          getNotesEditorHtml()
      };

  await saveEntry(entry);

  document
    .getElementById("entryForm")
    .reset();

  setDefaultEntryDate();

  window.location.href =
    journalId ? `/journals/${journalId}` : "/";
}

async function useGoodTimeTemplate() {
  const errorContainer =
    document.getElementById("templateError");

  if (errorContainer) {
    errorContainer.innerHTML = "";
  }

  const nameInput =
    document.getElementById("templateJournalName");

  const name =
    nameInput ? nameInput.value.trim() : "";

  if (!name) {
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Journal name is required.
        </div>
      `;
    }
    return;
  }

  try {
    const journal =
      await createJournalFromTemplate({
        name,
        template_type: "good_time"
      });

    window.location.href = `/journals/${journal.id}`;
  } catch (error) {
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${error.message}
        </div>
      `;
    }
  }
}

async function submitJournalForm(event) {
  event.preventDefault();

  const errorContainer =
    document.getElementById("journalError");

  if (errorContainer) {
    errorContainer.innerHTML = "";
  }

  try {
    const journal =
      await createJournal({
        name: document.getElementById("journalName").value
      });

    window.location.href = `/journals/${journal.id}`;
  } catch (error) {
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${error.message}
        </div>
      `;
    }
  }
}

function getJournalIdFromUrl() {
  const params =
    new URLSearchParams(window.location.search);

  const queryJournalId =
    params.get("journal_id") || params.get("id");

  if (queryJournalId) {
    return queryJournalId;
  }

  const journalMatch =
    window.location.pathname.match(/^\/journals\/(\d+)/);

  return journalMatch ? journalMatch[1] : null;
}

async function submitSignupForm(event) {
  event.preventDefault();
  clearAuthError();

  try {
    await signupUser({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    });

    window.location.href = "/";
  } catch (error) {
    renderAuthError(error.message);
  }
}

function getNotesEditorHtml() {
  if (window.notesEditor) {
    return window.notesEditor.getHTML();
  }

  const notes =
    document.getElementById("notes");

  return notes ? notes.value : "";
}

async function submitLoginForm(event) {
  event.preventDefault();

  console.log("Login form submitted");

  clearAuthError();

  try {
    await loginUser({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    });

    window.location.href = "/";
  } catch (error) {
    console.error(error);
    renderAuthError(error.message);
  }
}


function clearAuthError() {
  const authError =
    document.getElementById("authError");

  if (authError) {
    authError.innerHTML = "";
  }
}

function renderAuthError(message) {
  const authError =
    document.getElementById("authError");

  if (!authError) {
    return;
  }

  authError.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>
  `;
}

async function removeEntry(id) {

  const confirmed = confirm(
    "Are you sure you want to delete this journal entry?"
  );

  if (!confirmed) {
    return;
  }

  try {

    await deleteEntry(id);

    const journalId =
      window.currentJournalId || getJournalIdFromUrl();

    window.location.href =
      journalId ? `/journals/${journalId}` : "/";

  } catch (error) {

    const errorContainer =
      document.getElementById("deleteError");

    if (errorContainer) {
      errorContainer.innerHTML = `
        <div
          class="alert alert-danger mt-3"
          role="alert"
        >
          Unable to delete journal entry.
          Please try again.
        </div>
      `;
    }

  }
}
