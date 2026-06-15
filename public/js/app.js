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

async function loadEntries() {

  const entries =
    await fetchEntries();

  renderEntries(entries);
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

async function submitLoginForm(event) {
  event.preventDefault();
  clearAuthError();

  try {
    await loginUser({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    });

    window.location.href = "/";
  } catch (error) {
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

    window.location.href = "/";

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
