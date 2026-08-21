const appState = {

  journals: [],

  entries: [],

  selectedJournalId: null,

  selectedEntryId: null,

  entrySearchQuery: "",

  sidebarCollapsed: false,

  isEditorDirty: false

};

window.appState = appState;

async function setupWelcomePage() {

  const form =
    document.getElementById("welcomeForm");

  if (!form) {
    return;
  }

  try {
    const profile =
      await fetchProfile();

    if (profile) {
      window.location.href = "/";
      return;
    }
  } catch (error) {
    renderAuthError(
      "Unable to start Chapters. Please restart the application."
    );
    return;
  }

  const nameInput =
    document.getElementById("displayName");

  if (nameInput) {
    nameInput.focus();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthError();

    const displayName =
      String(nameInput?.value || "").trim();

    if (!displayName || displayName.length > 40) {
      renderAuthError(
        "Please enter a name using 1 to 40 characters."
      );
      return;
    }

    const submitButton =
      form.querySelector("button[type='submit']");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Opening Chapters...";
    }

    try {
      await createProfile({
        display_name: displayName
      });

      window.location.href = "/";
    } catch (error) {
      renderAuthError(
        "Unable to create your profile. Please try again."
      );

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Continue";
      }
    }
  });
}

function toggleSidebar() {

    appState.sidebarCollapsed =
        !appState.sidebarCollapsed;

    document.body.classList.toggle(
        "sidebar-collapsed",
        appState.sidebarCollapsed
    );

    const icon =
        document.getElementById("sidebarToggleIcon");

    if (icon) {

        icon.className =
            appState.sidebarCollapsed
                ? "bi bi-layout-sidebar"
                : "bi bi-layout-sidebar-inset";

    }

}
function getFilteredEntries() {
  const query =
    appState.entrySearchQuery.trim().toLowerCase();

 const entries =
    appState.entries.filter(
        (entry) =>
            String(entry.journal_id) ===
            String(appState.selectedJournalId)
    );

  if (!query) {
    return entries;
  }

  return entries.filter((entry) => {
    const searchableText = [
      entry.title,
      entry.preview,
      entry.activity,
      entry.notes,
      entry.content
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

}
window.getFilteredEntries = getFilteredEntries;

let pendingDeleteEntryId = null;
let pendingDeleteJournalId = null;
let activeJournalId = null;
let editingJournalId = null;

function getEntriesForSelectedJournal() {

    return appState.entries.filter(
        (entry) =>
            String(entry.journal_id) ===
            String(appState.selectedJournalId)
    );

}

function getWritableJournalId() {
  return appState.selectedJournalId;
}

function findEntryToSelectAfterDelete(deletedEntryId, entriesBeforeDelete) {
  const visibleEntries =
    entriesBeforeDelete || getFilteredEntries();

  const deletedIndex =
    visibleEntries.findIndex(
      (entry) => String(entry.id) === String(deletedEntryId)
    );

  if (deletedIndex === -1) {
    return null;
  }

  return (
    visibleEntries[deletedIndex + 1] ||
    visibleEntries[deletedIndex - 1] ||
    null
  );
}

function renderInitialLoadingStates() {
  const journalList =
    document.getElementById("journalList");

  if (journalList) {
    journalList.innerHTML = `
      <div class="skeleton-stack" aria-label="Loading journals">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    `;
  }

  const entryList =
    document.getElementById("entryList");

  if (entryList) {
    entryList.innerHTML = `
      <div class="skeleton-stack entry-list-skeleton" aria-label="Loading entries">
        <div class="skeleton-entry"></div>
        <div class="skeleton-entry"></div>
        <div class="skeleton-entry"></div>
      </div>
    `;
  }

  renderEditorEmptyState("Loading...", "Your writing space is getting ready.");
}

function renderEmptyState({
  title,
  description,
  actionLabel,
  actionId,
  icon = "bi-journal-text"
}) {
  return `
    <div class="app-empty-state">
      <i class="bi ${icon}" aria-hidden="true"></i>
      <h3>${title}</h3>
      <p>${description}</p>
      ${
        actionLabel
          ? `<button class="btn btn-primary btn-sm" id="${actionId}" type="button">${actionLabel}</button>`
          : ""
      }
    </div>
  `;
}

function bindEmptyStateActions() {
  document
    .getElementById("emptyCreateJournalButton")
    ?.addEventListener("click", () => {
      const modalElement =
        document.getElementById("createJournalModal");

      if (modalElement) {
        new bootstrap.Modal(modalElement).show();
      }
    });

  document
    .getElementById("emptyNewEntryButton")
    ?.addEventListener("click", createNewEntryFromEditor);

  document
    .getElementById("clearSearchButton")
    ?.addEventListener("click", () => {
      const searchInput =
        document.getElementById("entrySearch");

      appState.entrySearchQuery = "";

      if (searchInput) {
        searchInput.value = "";
      }

      renderEntryList(getFilteredEntries());
    });
}

function renderEditorEmptyState(title = "Select an entry", description = "or create a new one.") {
  const editorDate =
    document.getElementById("editorDate");

  const saveStatus =
    document.getElementById("saveStatus");

  const previewPanel =
    document.getElementById("entryPreview");

  if (editorDate) {
    editorDate.textContent = "";
  }

  if (saveStatus) {
    saveStatus.textContent = "";
    saveStatus.dataset.state = "";
  }

  if (previewPanel) {
    previewPanel.classList.add("editor-empty");
  }

  if (window.notesEditor) {
    window.notesEditor.commands.clearContent();
    window.notesEditor.setEditable(false);
  }

  document
    .querySelectorAll(
      ".editor-toolbar button, #deleteEntryButton, #insertImageButton"
    )
    .forEach((button) => {
      button.disabled = true;
    });

  const editorBody =
    document.querySelector(".editor-body");

  if (editorBody) {
    editorBody.dataset.emptyTitle = title;
    editorBody.dataset.emptyDescription = description;
  }
}

function activateEditor() {
  const previewPanel =
    document.getElementById("entryPreview");

  if (previewPanel) {
    previewPanel.classList.remove("editor-empty");
  }

  if (window.notesEditor) {
    window.notesEditor.setEditable(true);
  }

  document
    .querySelectorAll(
      ".editor-toolbar button, #deleteEntryButton, #insertImageButton"
    )
    .forEach((button) => {
      button.disabled = false;
    });
}

async function createNewEntryFromEditor() {
  if (appState.isEditorDirty) {
    const shouldCreate =
      window.confirm("Discard current changes?");

    if (!shouldCreate) {
      return;
    }
  }

  const journalId =
    getWritableJournalId();

  if (!journalId) {
    const modalElement =
      document.getElementById("createJournalModal");

    if (modalElement) {
      new bootstrap.Modal(modalElement).show();
    }

    return;
  }

  try {
    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const entry =
      await saveEntry({
        journal_id: journalId,
        title: "Untitled",
        content: "<p></p>",
        entry_date: today
      });

    appState.entries.unshift(entry);
    appState.entrySearchQuery = "";

    const searchInput =
      document.getElementById("entrySearch");

    if (searchInput) {
      searchInput.value = "";
    }

    renderEntryList(getFilteredEntries());
    selectEntry(entry.id);
  } catch (error) {
    console.error(error);
    renderEditorEmptyState("Unable to create entry", "Please try again.");
  }
}

function openDeleteEntryModal(entryId) {
  pendingDeleteEntryId = entryId;

  const modalElement =
    document.getElementById("deleteEntryModal");

  if (!modalElement) {
    return;
  }

  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

async function confirmDeleteEntry() {
  if (!pendingDeleteEntryId) {
    return;
  }

  const entriesBeforeDelete =
    getFilteredEntries();

  const replacementEntry =
    findEntryToSelectAfterDelete(
      pendingDeleteEntryId,
      entriesBeforeDelete
    );

  const confirmButton =
    document.getElementById("confirmDeleteEntryButton");

  if (confirmButton) {
    confirmButton.disabled = true;
    confirmButton.textContent = "Deleting...";
  }

  const errorContainer =
    document.getElementById("deleteEntryError");

  if (errorContainer) {
    errorContainer.innerHTML = "";
  }

  try {
    await deleteEntry(pendingDeleteEntryId);

    appState.entries = appState.entries.filter(
      (entry) => String(entry.id) !== String(pendingDeleteEntryId)
    );

    if (String(appState.selectedEntryId) === String(pendingDeleteEntryId)) {
      appState.selectedEntryId = null;

      if (replacementEntry) {
        selectEntry(replacementEntry.id);
      } else {
        loadEntryIntoEditor(null);
      }
    }

    renderEntryList(getFilteredEntries());

    const modalElement =
      document.getElementById("deleteEntryModal");

    if (modalElement) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }
    }

    pendingDeleteEntryId = null;

    const journalId =
      window.currentJournalId || getJournalIdFromUrl();

    if (journalId && document.getElementById("journalTitle")) {
      window.location.href = `/journals/${journalId}`;
    }
  } catch (error) {
    console.error(error);

    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Unable to delete journal entry. Please try again.
        </div>
      `;
    }
  } finally {
    if (confirmButton) {
      confirmButton.disabled = false;
      confirmButton.textContent = "Delete Entry";
    }
  }
}
window.confirmDeleteEntry = confirmDeleteEntry;
async function confirmDeleteJournal() {

    if (!pendingDeleteJournalId) {
        return;
    }

    const button =
        document.getElementById(
            "confirmDeleteJournalButton"
        );

    button.disabled = true;
    button.textContent = "Deleting...";

    try {

        await deleteJournal(
            pendingDeleteJournalId
        );

        pendingDeleteJournalId = null;

        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "deleteJournalModal"
                )
            )
            .hide();

        await loadJournals();

        if (appState.journals.length > 0) {

            selectJournal(
                appState.journals[0].id
            );

        }
        else {

            renderEditorEmptyState(
                "Welcome to Chapters",
                "Start your first journal."
            );

        }

    }
    catch (error) {

        document.getElementById(
            "deleteJournalError"
        ).innerHTML = `
            <div class="alert alert-danger">
                Unable to delete journal.
            </div>
        `;

    }
    finally {

        button.disabled = false;
        button.textContent = "Delete Journal";

    }

}
function selectJournal(journalId) {

  appState.selectedJournalId = journalId;
  appState.selectedEntryId = null;

  document
    .querySelectorAll(".sidebar-item")
    .forEach((item) => {
      item.classList.remove("active");
    });

  const selectedButton =
    document.querySelector(
      `.sidebar-item[data-journal-id="${journalId}"]`
    );

  if (selectedButton) {
    selectedButton.classList.add("active");
  }

  renderEntryList(getFilteredEntries());
  loadEntryIntoEditor(null);

}
function openJournalContextMenu(button, journalId) {

    activeJournalId = journalId;

    const menu = document.getElementById("journalContextMenu");

    const rect = button.getBoundingClientRect();

    menu.style.left = `${rect.right + 8}px`;
    menu.style.top = `${rect.top}px`;

    menu.classList.add("show");

}

function closeJournalContextMenu() {

    document
        .getElementById("journalContextMenu")
        .classList
        .remove("show");

}
document.addEventListener(
  "DOMContentLoaded",
  async () => {
  
  const toggleSidebarButton =
    document.getElementById(
        "toggleSidebarButton"
    );


    const page =
      document.body.dataset.page;

    if (page === "welcome") {
      setupWelcomePage();
      return;
    }

    let profile;

    try {
      profile = await fetchProfile();
    } catch (error) {
      document.body.innerHTML = `
        <main class="app-startup-error">
          <h1>Unable to start Chapters.</h1>
          <p>Please restart the application.</p>
        </main>
      `;
      return;
    }

    if (!profile) {
      window.location.href = "/welcome.html";
      return;
    }

    renderProfileHeader(profile);


    renderInitialLoadingStates();


if (toggleSidebarButton) {

    toggleSidebarButton.addEventListener(
        "click",
        toggleSidebar
    );

}

    const journalsContainer =
      document.getElementById("journals");

    const journalSidebar =
      document.getElementById("journalList");

    if (journalsContainer || journalSidebar) {
      loadJournals();
    }
    const createJournalButton =
    document.getElementById("createJournalButton");

    const deleteEntryButton =
      document.getElementById("deleteEntryButton");

    if (deleteEntryButton) {
      deleteEntryButton.addEventListener("click", () => {
        if (!appState.selectedEntryId) {
          return;
        }

        openDeleteEntryModal(appState.selectedEntryId);
      });
    }

    const entrySearch =
      document.getElementById("entrySearch");

    if (entrySearch) {
      entrySearch.addEventListener("input", () => {
        appState.entrySearchQuery =
          entrySearch.value.trim();

        renderEntryList(getFilteredEntries());
      });
    }

    const confirmDeleteEntryButton =
      document.getElementById("confirmDeleteEntryButton");

    if (confirmDeleteEntryButton) {
      confirmDeleteEntryButton.addEventListener(
        "click",
        confirmDeleteEntry
      );
    }

if (createJournalButton) {

  createJournalButton.addEventListener(
    "click",
    openCreateJournalModal
);

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

   

    setupJournalColorPicker();

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

    const editorNewButton =
  document.getElementById("editorNewButton");



if (editorNewButton) {

    editorNewButton.addEventListener(
        "click",
        createNewEntryFromEditor
    );

}

const confirmDeleteJournalButton =
    document.getElementById(
        "confirmDeleteJournalButton"
    );

if (confirmDeleteJournalButton) {

    confirmDeleteJournalButton.addEventListener(
        "click",
        confirmDeleteJournal
    );

}

const deleteJournalAction =
    document.getElementById(
        "deleteJournalAction"
    );

if (deleteJournalAction) {

    deleteJournalAction.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closeJournalContextMenu();

            pendingDeleteJournalId =
                activeJournalId;

            new bootstrap.Modal(
                document.getElementById(
                    "deleteJournalModal"
                )
            ).show();

        }
    );

}

document.addEventListener(
    "click",
    () => {

        closeJournalContextMenu();

    }
);

document
    .getElementById("journalContextMenu")
    ?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

        }
    );

document
    .getElementById("journalSettingsAction")
    ?.addEventListener(
        "click",
        () => {

            console.log("Journal Settings clicked");
            console.log("Active Journal:", activeJournalId);

            closeJournalContextMenu();

            openEditJournalModal(activeJournalId);

        }
    );
  


function renderProfileHeader(profile) {
  const userName =
    document.querySelector(".sidebar-profile-name");

  if (userName) {
    userName.textContent = profile.display_name;
  }

  const avatar =
    document.querySelector(".user-avatar");

  if (avatar) {
    avatar.textContent =
      getProfileInitials(profile.display_name);
    avatar.title = profile.display_name;
  }
}
});

function getProfileInitials(name) {
  return String(name || "C")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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

  const entries = await fetchEntries();

const filteredEntries =
    entries.filter(
        (entry) =>
            String(entry.journal_id) ===
            String(appState.selectedJournalId)
    );

  renderEntries(filteredEntries);
}

async function loadJournals() {
  try {

  const journals =
    await fetchJournals();

  const entries =
    await fetchEntries();

  appState.journals =
    journals;

  appState.entries =
    entries;
    if (
    journals.length > 0 &&
    !appState.selectedJournalId
) {

    appState.selectedJournalId =
        journals[0].id;

}

  renderEntryList(
    getFilteredEntries()
  );

  renderJournalSidebar(
    appState.journals
  );

  if (appState.journals.length === 0 && appState.entries.length === 0) {
    renderEditorEmptyState(
      "Welcome to Chapters",
      "Start your first journal."
    );
  } else {
    renderEditorEmptyState();
  }

  } catch (error) {
    console.error(error);

    const entryList =
      document.getElementById("entryList");

    if (entryList) {
      entryList.innerHTML = renderEmptyState({
        title: "Unable to load entries",
        description: "Please refresh the page and try again.",
        icon: "bi-exclamation-triangle"
      });
    }

    renderEditorEmptyState("Unable to load editor", "Please refresh the page.");
  }

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

    renderEntryList(entries);
  } catch (error) {
    document.getElementById("entries").innerHTML = `
      <div class="alert alert-warning" role="alert">
        Journal could not be found.
      </div>
    `;
  }
  window.renderEntryList = renderEntryList;
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

    appState.selectedJournalId = journal.id;

    highlightActiveJournal();

    loadEntries();
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

    let journal;

    if (editingJournalId) {

        journal =
            await updateJournal(
                editingJournalId,
                {
                    name: document.getElementById("journalName").value.trim(),
                    color: selectedJournalColor
                }
            );

    } else {

        journal =
            await createJournal({
                name: document.getElementById("journalName").value.trim(),
                color: selectedJournalColor
            });

    }

    editingJournalId = null;

    await loadJournals();

    selectJournal(journal.id);

    document.getElementById("journalForm").reset();

    bootstrap.Modal
        .getInstance(
            document.getElementById("createJournalModal")
        )
        .hide();

}
catch (error) {

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

function getNotesEditorHtml() {
  if (window.notesEditor) {
    return window.notesEditor.getHTML();
  }

  const notes =
    document.getElementById("notes");

  return notes ? notes.value : "";
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

  if (document.getElementById("deleteEntryModal")) {
    openDeleteEntryModal(id);
    return;
  }

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

async function selectEntry(entryId) {

  const entry =
    appState.entries.find(
      entry => String(entry.id) === String(entryId)
    );

  appState.selectedEntryId = null;

  loadEntryIntoEditor(entry);

  appState.selectedEntryId = entry ? entry.id : null;

  renderEntryList(
    getFilteredEntries()
  );

}
window.selectEntry = selectEntry;

function loadEntryIntoEditor(entry) {

    if (!entry) {

        renderEditorEmptyState();
        appState.isEditorDirty = false;
        return;

    }

    activateEditor();

    document.getElementById("editorDate").textContent =
        formatEntryDate(entry.entry_date);

    if (window.notesEditor) {
        const content =
            entry.content || entry.notes || "<p></p>";
        const loadedWithGuard =
            typeof window.loadEditorContent === "function";

        if (loadedWithGuard) {
            window.loadEditorContent(content);
        } else {
            window.notesEditor.commands.setContent(content);
            window.notesEditor.commands.focus("start");
        }

        if (!loadedWithGuard && typeof window.markEditorSaved === "function") {
          window.markEditorSaved(content);
        }
    }

    appState.isEditorDirty = false;

}

let selectedJournalColor = "#8B5CF6";

function openEditJournalModal(journalId) {

    const journal =
        appState.journals.find(
            (item) => String(item.id) === String(journalId)
        );

    if (!journal) {
        return;
    }

    configureJournalModal(
        "edit",
        journal
    );

    new bootstrap.Modal(
        document.getElementById("createJournalModal")
    ).show();

}


function configureJournalModal(mode, journal = null) {

    const isEdit =
        mode === "edit";

    editingJournalId =
        isEdit ? journal.id : null;

    document.getElementById("journalForm").reset();

    document.getElementById(
        "journalError"
    ).innerHTML = "";

    selectedJournalColor =
        isEdit
            ? journal.color
            : "#8B5CF6";

    document
        .querySelectorAll(".journal-color")
        .forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.color === selectedJournalColor
            );

        });

    document.getElementById(
        "journalName"
    ).value =
        isEdit
            ? journal.name
            : "";

    document.getElementById(
        "createJournalModalTitle"
    ).textContent =
        isEdit
            ? "Edit Journal"
            : "Create Journal";

    document.getElementById(
        "saveJournalButton"
    ).textContent =
        isEdit
            ? "Save Changes"
            : "Create Journal";

}

function openCreateJournalModal() {

    configureJournalModal("create");

    new bootstrap.Modal(
        document.getElementById("createJournalModal")
    ).show();

}

function setupJournalColorPicker() {

    const colorButtons =
        document.querySelectorAll(".journal-color");

    if (colorButtons.length === 0) {
        return;
    }

    colorButtons.forEach((button) => {

        button.addEventListener("click", () => {

            colorButtons.forEach((item) =>
                item.classList.remove("active")
            );

            button.classList.add("active");

            selectedJournalColor =
                button.dataset.color;

        });

    });

}
  


