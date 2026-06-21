# Feature Spec: Journal-Centric Architecture with Independent Templates

## Status

Proposed

---

# Background

Chapters is evolving from a single-purpose Good Time Journal application into a journaling platform.

The platform should support:

* Multiple journals per user
* Independent journal creation
* Optional template usage
* Existing Good Time Journal functionality

Templates and journals are separate concepts.

---

# Core Principle

```text
Journal ≠ Template
```

A journal is a user's personal container for entries.

A template is an optional starting point used to create a journal.

Templates should never be required to create a journal.

---

# Goal

Introduce Journals as the primary object in the system while preserving existing Good Time Journal functionality.

New navigation:

```text
Home
│
├── Journals
│
├── Templates
│
└── Settings
```

---

# User Stories

### Journal Creation

As a user,

I want to create journals directly,

So that I can organize different parts of my life.

---

### Template Usage

As a user,

I want to start from a template,

So that I don't need to create a journal structure from scratch.

---

# Success Criteria

Users can:

* View journals
* Create journals
* Open journals
* Create entries within journals
* View templates
* Create journals from templates
* Continue using existing Good Time Journal data

---

# Information Architecture

```text
Home

├── Journals
│
│   ├── Personal Reflections
│   ├── Travel Notes
│   ├── Reading Notes
│   └── Career Journal
│
└── Templates

    ├── Good Time Journal
    ├── Daily Reflection
    └── Gratitude Journal
```

---

# Home Page

## Purpose

Serve as the primary landing page after login.

---

## Layout

```text
My Journals

+ New Journal

--------------------------------

Personal Reflections
12 Entries

Travel Notes
8 Entries

Reading Notes
5 Entries

--------------------------------

Browse Templates →
```

---

## Actions

### Create Journal

Opens:

```text
/journals/new
```

---

### Open Journal

Opens:

```text
/journals/:id
```

---

### Browse Templates

Opens:

```text
/templates
```

---

# Create Journal Page

## Purpose

Allow users to create a journal without selecting a template.

---

## Layout

```text
Create Journal

Journal Name

[___________________]

Create Journal
```

---

## Fields

### Journal Name

Required

Examples:

```text
Personal Reflections

Travel Notes

2026 Goals

Reading Journal
```

---

## Behavior

Creates:

```text
Journal
```

with:

```text
name
user_id
created_at
```

Then redirects to:

```text
/journals/:id
```

---

# Templates Page

## Purpose

Display available templates.

Templates are optional.

Templates are not journals.

---

## Layout

```text
Templates

--------------------------------

Good Time Journal

Track activities that energize you
and identify patterns over time.

[ Use Template ]

--------------------------------

Daily Reflection

Coming Soon

--------------------------------

Gratitude Journal

Coming Soon

--------------------------------
```

---

# Use Template Flow

## Step 1

User opens:

```text
/templates
```

---

## Step 2

User clicks:

```text
Use Template
```

for:

```text
Good Time Journal
```

---

## Step 3

User provides:

```text
Journal Name

[___________________]
```

Example:

```text
My Good Times

Work Energy Tracker

2026 Happiness Journal
```

---

## Step 4

System creates:

```text
Journal
```

with:

```text
template_type = good_time
```

---

## Step 5

Redirect:

```text
/journals/:id
```

---

# Journal Detail Page

## Purpose

Display entries belonging to a journal.

---

## Layout

```text
Personal Reflections

+ New Entry

--------------------------------

Entries

--------------------------------
```

---

## Header

Display:

```text
Journal Name

Entry Count
```

---

# Entry Creation

## Standard Journal

Fields:

```text
Title

Content
```

---

## Good Time Journal

Reuse existing implementation.

Fields:

```text
Date

Activity

Energy

Engagement

Notes
```

No changes required.

---

# Existing Good Time Journal Migration

## Existing Users

Create:

```text
Journal Name:
Good Time Journal
```

---

## Existing Entries

Associate all existing entries with:

```text
Good Time Journal
```

journal.

---

## Data Preservation

No user data should be lost.

No existing entry should be modified.

---

# Data Model

## Journals

```text
id
user_id
name
template_type
created_at
```

---

## Entries

Add:

```text
journal_id
```

---

# Journal Types

### Standard Journal

```text
template_type = null
```

or

```text
template_type = standard
```

---

### Good Time Journal

```text
template_type = good_time
```

---

# Out of Scope

Not included in this iteration:

* Custom templates
* Template editor
* AI summaries
* Search
* Journal sharing
* Rich text editor
* Journal archive
* Tags

---

# Acceptance Criteria

✅ Home displays journals

✅ Users can create journals without using templates

✅ Users can create unlimited journals

✅ Templates are optional

✅ Templates live in a separate Templates section

✅ Good Time Journal exists as a template

✅ Users can create journals from Good Time Journal template

✅ Existing Good Time Journal data is preserved

✅ Existing entries are migrated to a Good Time Journal journal

✅ Journals and Templates are treated as separate concepts
