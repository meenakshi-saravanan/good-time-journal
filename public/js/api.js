async function fetchEntries() {
  const response = await fetch("/api/journal");
  return await response.json();
}

async function saveEntry(entry) {
  await fetch("/api/journal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entry)
  });
}

async function deleteEntry(id) {
  await fetch(`/api/journal/${id}`, {
    method: "DELETE"
  });
}