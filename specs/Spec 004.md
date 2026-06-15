# Spec 004 — Journal Entry List & Detail View

## Status

Proposed

---

# Background

The current home page displays journal entries as large cards containing all available information.

Each card displays:

* Activity
* Date
* Energy
* Engagement
* Notes
* Delete action

While this approach works for a small number of entries, it does not scale as the journal grows.

As users create more entries, it becomes increasingly difficult to:

* Scan entries quickly
* Compare activities
* Find specific entries
* Understand journal history at a glance

---

# Problem Statement

The current card-based layout prioritizes reading individual entries rather than browsing a collection of entries.

Users opening the application are primarily trying to answer:

* What entries have I created recently?
* What activity did I record?
* When did I record it?
* Which entry do I want to review?

The current layout requires excessive scrolling and makes comparison difficult.

---

# Goal

Transform the home page into a scalable journal index that enables users to quickly browse journal entries and open individual entries for detailed review.

---

# Success Criteria

Users can:

* Quickly scan recent journal entries
* Compare activities across entries
* Open a specific journal entry for detailed review
* Spend less time scrolling through journal history

---

# Scope

## In Scope

* Replace card-based entry display
* Introduce tabular journal list
* Introduce journal detail page
* Add View action
* Improve entry discoverability

## Out of Scope

* Search
* Filtering
* Sorting controls
* Editing entries
* Analytics
* Dashboard

---

# User Story

As a user maintaining a Good Time Journal,

I want to see a concise list of journal entries,

So that I can quickly find and review specific reflections.

---

# UX Changes

## Home Page

### Current

Home page displays:

* Recent Entries heading
* Add New Entry button
* Journal entry cards

---

### Proposed

Home page displays:

* Recent Entries heading
* Add New Entry button
* Journal Entries table

---

### Table Columns

| Column     | Description               |
| ---------- | ------------------------- |
| Date       | Entry date                |
| Activity   | Activity name             |
| Energy     | Energy score              |
| Engagement | Engagement score          |
| View       | Opens journal detail page |

---

### Example

| Date        | Activity | Energy | Engagement |      |
| ----------- | -------- | ------ | ---------- | ---- |
| 31 May 2026 | Walking  | 2/5    | 2/5        | View |
| 30 May 2026 | Cycling  | 5/5    | 4/5        | View |
| 29 May 2026 | Cooking  | 4/5    | 5/5        | View |

---

# Journal Detail Page

## Purpose

Provide a dedicated screen for reading a complete journal entry.

---

## Route

```text
/journal-entry.html?id={entryId}
```

Example:

```text
/journal-entry.html?id=12
```

---

## Layout

Display:

* Back to Recent Entries
* Activity
* Date
* Energy
* Engagement
* Notes

---

### Example

Activity

Walking

Date

31 May 2026

Energy

2/5

Engagement

2/5

Notes

Felt tired after work.
Used the walk to clear my head.

---

# Functional Requirements

## FR-1 Journal Table

System shall replace journal cards with a table view.

---

## FR-2 Journal Row Display

System shall display:

* Date
* Activity
* Energy
* Engagement

for every journal entry.

---

## FR-3 View Action

System shall display a View action for every row.

---

## FR-4 Journal Detail Navigation

When user clicks View

System shall navigate to:

```text
/journal-entry.html?id={entryId}
```

---

## FR-5 Journal Detail Retrieval

System shall retrieve the selected journal entry using its ID.

---

## FR-6 Journal Detail Display

System shall display:

* Date
* Activity
* Energy
* Engagement
* Notes

for the selected entry.

---

## FR-7 Back Navigation

Journal Detail page shall provide navigation back to:

```text
/
```

or

```text
/index.html
```

---

# Data Requirements

No database schema changes required.

Existing table:

```sql
journal_entries
```

contains all required data.

---

# API Requirements

## Existing Endpoint

```http
GET /api/journal
```

Used for journal list.

---

## New Endpoint

```http
GET /api/journal/:id
```

Returns a single journal entry.

---

### Example Response

```json
{
  "id": 12,
  "entry_date": "2026-05-31",
  "activity": "Walking",
  "energy": 2,
  "engagement": 2,
  "notes": "Used the walk to clear my head."
}
```

---

# Technical Requirements

## TR-1 Table Implementation

Journal list shall use Bootstrap Table component.

Recommended:

```html
<table class="table table-hover">
```

---

## TR-2 View Action

View action shall use Bootstrap Button or Link styles.

Recommended:

```html
<a
  class="btn btn-sm btn-outline-primary"
>
  View
</a>
```

---

## TR-3 Journal Detail Layout

Journal detail page shall use Bootstrap Cards and Typography utilities.

---

# Non-Functional Requirements

## NFR-1 Scalability

Journal list shall remain usable with 100+ entries.

---

## NFR-2 Readability

Users shall be able to scan recent entries without excessive scrolling.

---

## NFR-3 Mobile Support

Table shall remain usable on mobile devices using Bootstrap responsive table utilities.

Recommended:

```html
<div class="table-responsive">
```

---

# Acceptance Criteria

Given journal entries exist

When user opens Home Page

Then entries are displayed in a table.

---

Given user clicks View

When journal detail page loads

Then selected journal entry information is displayed.

---

Given user views a journal entry

When page is displayed

Then user can see:

* Activity
* Date
* Energy
* Engagement
* Notes

---

Given user finishes reviewing a journal entry

When Back is clicked

Then user returns to Recent Entries.

---

# Risks

As the journal grows, users may eventually require:

* Search
* Sorting
* Filtering

These capabilities are intentionally deferred to future iterations.

---

# Future Opportunities

After this change:

* Search Entries
* Filter by Activity
* Sort by Energy
* Sort by Engagement
* Edit Journal Entry
* Delete Journal Entry from Detail View
* Insights Dashboard
* Activity Analytics
