# Feature Spec: Journal-Based Navigation & Templates

## Status

Proposed

---

## Background

Chapters currently supports a single journaling experience:

```text
Good Time Journal
 └── Entries
```

The product is evolving into a journaling platform where users can maintain multiple journals.

The existing Good Time Journal functionality should remain unchanged and become the first built-in journal template.

---

## Problem

The current application assumes all entries belong to a single journal.

Users cannot:

* Organize entries into separate journals
* Create additional journals
* Browse available journal templates
* Use multiple journaling methods within the same account

---

## Goal

Introduce Journals as a first-class object in the system.

New navigation:

```text
Home
 ↓
Journals
 ↓
Journal
 ↓
Entries
```

The existing Good Time Journal becomes a journal template.

---

## User Story

As a user,

I want to create and manage multiple journals,

So that I can organize different areas of my life separately.

---

## Success Criteria

Users can:

* View all journals
* Open a journal
* View entries belonging to that journal
* Create journals from templates
* Continue using Good Time Journal exactly as before

---

# Navigation Changes

## Current

```text
Home
 ↓
Entries
```

## Future

```text
Home
 ↓
Journals
 ↓
Entries
```

---

# Home Page

## Purpose

Provide a landing page for all journals.

---

## Layout

```text
My Journals

[ View Templates ]

--------------------------------

Good Time Journal
42 Entries

Daily Reflection
18 Entries

Travel Journal
7 Entries

--------------------------------
```

---

## Actions

### Open Journal

Clicking a journal card opens:

```text
/journals/:id
```

---

### View Templates

Primary action:

```text
View Templates
```

Opens:

```text
/templates
```

---

# Templates Page

## Purpose

Allow users to create journals from predefined templates.

---

## Layout

```text
Templates

Good Time Journal
Track activities that energize you.

[ Use Template ]

--------------------------------

More templates coming soon

Daily Reflection
Gratitude Journal
Travel Journal

--------------------------------
```

---

## MVP

Only one active template:

```text
Good Time Journal
```

All other templates displayed as:

```text
Coming Soon
```

---

# Create Journal

## Flow

User clicks:

```text
Use Template
```

System creates:

```text
Journal Name:
Good Time Journal

Template:
good_time
```

and redirects to:

```text
/journals/:id
```

---

# Journal Detail Page

## Purpose

Display entries belonging to a specific journal.

---

## Layout

```text
Good Time Journal

+ New Entry

--------------------------------

Date
Activity
Energy
Engagement
View

--------------------------------
```

---

## Existing Functionality

Reuse current:

* Entries table
* New Entry flow
* Journal detail page
* Delete entry flow

No changes to Good Time Journal entry schema.

---

# Data Model

## Journal

```text
id
user_id
name
template_type
created_at
```

---

## Entry

Add:

```text
journal_id
```

All existing entries should belong to:

```text
Good Time Journal
```

after migration.

---

# Migration

## Existing Users

For every user:

Automatically create:

```text
Good Time Journal
```

and associate all existing entries with it.

Users should not lose any data.

---

# Out of Scope

Not included in this iteration:

* Custom templates
* AI summaries
* Journal sharing
* Journal collaboration
* Template builder
* Cross-journal search
* Rich text editor

---

# Future Opportunities

Phase 2:

```text
Custom Journal
```

with:

```text
Title
Content
```

entries.

---

Phase 3:

Additional templates:

```text
Daily Reflection
Gratitude Journal
Travel Journal
Dream Journal
```

---

Phase 4:

AI-powered insights across journals:

```text
Monthly Reflection

Patterns Across Journals

Personal Growth Summary
```
