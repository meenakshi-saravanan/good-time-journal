# Journal API Documentation

## Base URL

/api/journal

---

## Get All Entries

GET /

### Response

Returns all journal entries ordered by date.

---

## Get Single Entry

GET /:id

### Response

Returns a single journal entry.

---

## Create Entry

POST /

### Request Body

{
  "entry_date": "2026-06-21",
  "activity": "Walking",
  "energy": 4,
  "engagement": 5,
  "notes": "Felt productive"
}

### Validation

Required fields:

- entry_date
- activity
- energy
- engagement

---

## Delete Entry

DELETE /:id

### Response

204 No Content

### Errors

404 Journal entry not found
500 Unable to delete journal entry