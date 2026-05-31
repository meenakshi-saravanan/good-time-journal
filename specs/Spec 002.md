# Spec 002 — Simplified Home Experience

## Status

Implemented

---

# Background

The current home page combines:

* Journal entry form
* Recent entries list

on a single screen.

This creates a crowded experience where users are immediately presented with a large form before they can understand the purpose of the application.

Additionally, the journal entry form currently includes both:

* Description
* Notes

Users may perceive these fields as overlapping or repetitive, creating unnecessary friction when recording an entry.

---

# Problem Statement

Users should be able to quickly:

1. Review recent journal activity
2. Start a new journal entry

without being overwhelmed by a lengthy form.

The current experience increases cognitive load because:

* Entry form dominates the page
* Recent entries are pushed below the fold
* Description and Notes appear redundant

---

# Goal

Create a simpler and more focused home experience that encourages frequent journaling.

---

# Success Criteria

Users can:

* Understand recent activity immediately upon opening the app
* Start a new journal entry with a single action
* Complete a journal entry faster than before
* Experience less ambiguity when filling the form

---

# User Story

As a user maintaining a Good Time Journal,

I want to see my recent entries first,

so that I can quickly reconnect with my previous reflections before deciding to add a new one.

---

# Scope

## In Scope

* Home page redesign
* New Journal Entry CTA
* Recent entries list
* Remove Description field
* Entry form simplification

## Out of Scope

* Dashboard
* Analytics
* Search
* Filtering
* AI insights

---

# UX Changes

## Home Page

### Current

Home page displays:

* Journal form
* Recent entries

### Proposed

Home page displays:

* Application title
* Primary CTA
* Recent entries section

Layout:

Good Time Journal

[ New Entry ]

Recent Entries

Entry Card
Entry Card
Entry Card

---

## New Entry Flow

When user clicks:

New Entry

System navigates to:

/new-entry

---

## Journal Entry Screen

Fields:

* Date
* Activity
* Energy
* Engagement
* Notes

Removed:

* Description

---

# Rationale for Removing Description

Current fields:

Description
Notes

Both capture freeform thoughts.

Users may ask:

"What is the difference?"

This creates unnecessary decision-making.

Notes alone provides sufficient flexibility.

---

# Functional Requirements

## FR-1 Home Page

System shall display:

* Page title
* New Entry button
* Recent entries

---

## FR-2 Recent Entries

System shall display the latest journal entries.

Default sorting:

Newest first

---

## FR-3 New Entry Navigation

When user clicks New Entry

System shall open Journal Entry screen.

---

## FR-4 Entry Form Simplification

System shall remove Description field.

Remaining fields:

* Date
* Activity
* Energy
* Engagement
* Notes

---

# Data Model Changes

## Current

Journal Entry

* Date
* Activity
* Description
* Energy
* Engagement
* Notes

## Proposed

Journal Entry

* Date
* Activity
* Energy
* Engagement
* Notes

---

# Database Impact

No migration required.

Description column may remain unused.

Future cleanup can remove the column after data migration.

---

# Acceptance Criteria

Given user opens the application

When home page loads

Then user sees:

* App title
* New Entry button
* Recent entries

And does not see:

* Journal entry form

---

Given user clicks New Entry

When navigation occurs

Then journal entry screen opens.

---

Given user creates an entry

When form is displayed

Then fields include:

* Date
* Activity
* Energy
* Engagement
* Notes

And Description field is not displayed.

---

# Expected Outcome

The application feels:

* Simpler
* Faster
* Less intimidating
* More focused on reflection rather than form completion
