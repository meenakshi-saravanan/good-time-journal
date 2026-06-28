async function fetchEntries() {

    const response =
        await fetch("/api/journal");

    if (!response.ok) {
        throw new Error(
            "Unable to fetch entries."
        );
    }

    return await response.json();

}

async function readJsonResponse(response, fallbackMessage) {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  throw new Error(fallbackMessage);
}

async function fetchEntry(id) {
  const response = await fetch(`/api/journal/${id}`);

  if (response.ok) {
    return await response.json();
  }

  const entries =
    await fetchEntries();

  const entry =
    entries.find(
      (item) => String(item.id) === String(id)
    );

  if (!entry) {
    throw new Error("Unable to fetch journal entry.");
  }

  return entry;
}

async function saveEntry(entry) {

  const response =
    await fetch("/api/journal", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(entry)

    });

  if (!response.ok) {

    const error =
      await response.text();

    console.error(error);

    throw new Error(error);

  }

  return await response.json();

}

async function updateEntry(id, entry) {

    const response =
        await fetch(`/api/journal/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(entry)

        });

 if (response.status === 401) {

    window.location.href = "/login.html";
    return;

}

if (!response.ok) {

    throw new Error("Unable to update entry.");

}
    return await response.json();

}

async function fetchJournals() {
  const response = await fetch("/api/journals");

  if (response.status === 401) {
    window.location.href = "/login.html";
    return [];
  }

  return await response.json();
}

async function fetchJournal(id) {
  const response = await fetch(`/api/journals/${id}`);

  if (!response.ok) {
    throw new Error("Unable to fetch journal.");
  }

  return await response.json();
}

async function createJournalFromTemplate(journal) {
  const response = await fetch("/api/journals/from-template", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(journal)
  });

  const result =
    await readJsonResponse(
      response,
      "Unable to create journal from template."
    );

  if (!response.ok) {
    throw new Error(result.error || "Unable to create journal.");
  }

  return result;
}

async function createJournal(journal) {
  const response = await fetch("/api/journals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(journal)
  });

  const result =
    await readJsonResponse(
      response,
      "Unable to create journal."
    );

  if (!response.ok) {
    throw new Error(result.error || "Unable to create journal.");
  }

  return result;
}

async function deleteEntry(id) {

  const response =
    await fetch(`/api/journal/${id}`, {
      method: "DELETE"
    });

  if (!response.ok) {
    throw new Error(
      "Unable to delete journal entry."
    );
  }
}

async function getCurrentUser() {
  const response = await fetch("/api/auth/me");

  if (!response.ok) {
    throw new Error("Authentication required.");
  }

  return await response.json();
}

async function signupUser(user) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  const result =
    await readJsonResponse(
      response,
      "Unable to create account. Please restart the server and try again."
    );

  if (!response.ok) {
    throw new Error(result.error || "Unable to create account.");
  }

  return result;
}

async function loginUser(credentials) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const result =
    await readJsonResponse(
      response,
      "Unable to log in. Please restart the server and try again."
    );

  if (!response.ok) {
    throw new Error(result.error || "Unable to log in.");
  }

  return result;
}

async function logoutUser() {
  const response = await fetch("/api/auth/logout", {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Unable to log out.");
  }
}
