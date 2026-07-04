# Spec 0XX — Remove User-Based Architecture (Local Profile Migration)

## Status

Proposed

---

# Background

Chapters was originally designed as a web application where multiple users could create accounts and manage their own journals.

The product has now evolved into a **local-first desktop application**.

Only one person will use a given installation of Chapters.

Because of this, concepts like:

* User accounts
* Login
* Signup
* Passwords
* User IDs

are no longer required.

The application should instead revolve around a single local profile.

---

# Goal

Simplify the application's architecture by removing the dependency on the **users** table.

After this migration:

```text
Profile
    ↓
Journals
    ↓
Journal Entries
```

The application should no longer create, read, or update fake user records.

---

# Scope

## In Scope

* Remove dependency on users table
* Stop storing user_id
* Stop filtering journals by user
* Stop filtering entries by user
* Remove fake user creation
* Simplify onboarding

## Out of Scope

* Cloud sync
* Multiple profiles
* Online accounts

---

# Implementation Plan

This migration should be completed in four phases.

---

# Phase 1 — Remove Fake User Creation

## Purpose

The Welcome screen should create only a local profile.

No fake email, password or user record should be created.

---

## File

```
controllers/profileController.js
```

---

### Current Behaviour

When the user clicks Continue, the application:

```
Create User

↓

Create Profile

↓

Create Starter Journal

↓

Create Welcome Entry
```

---

### New Behaviour

```
Create Profile

↓

Create Starter Journal

↓

Create Welcome Entry
```

---

### Changes

#### Remove

Remove the entire block that inserts into:

```
users
```

including:

* fake email
* fake password
* fake user id

---

#### Keep

Continue to:

* validate display name
* create profile
* create starter journal
* create starter entry

---

#### Remove

```
migrateExistingLocalData()
```

This migration logic is no longer needed.

---

#### Delete

Delete the entire function

```
migrateExistingLocalData()
```

---

### Expected Result

Clicking Continue should only create:

* Profile
* Getting Started journal
* Welcome entry

---

# Phase 2 — Stop Journals Depending on Users

## Purpose

There is now only one profile.

Journals should no longer ask:

> Which user owns this journal?

Instead:

> Load every journal.

---

## File

```
controllers/journalsController.js
```

---

### Update Journal List Queries

Current

```
Load journals
WHERE user_id = ?
```

Replace with

```
Load all journals
```

---

### Update Single Journal Query

Current

```
Find journal

WHERE id = ?

AND user_id = ?
```

Replace with

```
Find journal

WHERE id = ?
```

---

### Update Create Journal

Current

Journal creation stores

```
user_id
```

Remove this completely.

Only save

* journal name
* template type
* timestamps

---

### Update Delete Journal

Current

Delete

```
WHERE id = ?

AND user_id = ?
```

Replace with

```
WHERE id = ?
```

---

### Expected Result

The application should continue to:

* create journals
* rename journals
* delete journals
* list journals

without using a user ID.

---

# Phase 3 — Stop Entries Depending on Users

## Purpose

Entries belong to journals.

They no longer need to belong directly to a user.

---

## File

```
controllers/entriesController.js
```

---

### Update Entry Queries

Replace every query that filters by

```
user_id
```

with journal-based queries.

---

### Update Create Entry

Stop saving

```
user_id
```

Store only

* journal_id
* title
* preview
* content
* date

---

### Update Delete Entry

Remove any

```
user_id
```

conditions.

Delete entries using only

```
entry id
```

---

### Update Update Entry

Remove any user checks.

---

### Expected Result

All entry functionality should continue working.

---

# Phase 4 — Simplify Database

This phase should only begin after Phases 1–3 have been fully tested.

---

## File

```
database/db.js
```

---

### Remove

```
CREATE TABLE users
```

---

### Remove

Any foreign keys pointing to

```
users
```

---

### Remove

```
user_id
```

from

```
journals
```

---

### Remove

```
user_id
```

from

```
journal_entries
```

---

## File

```
schema.sql
```

---

### Update Schema

New structure

```
Profile

↓

Journals

↓

Journal Entries
```

No user table.

No user_id columns.

---

## File

```
controllers/profileController.js
```

---

### Remove

Any remaining references to

```
LOCAL_PROFILE_ID
```

used only for fake users.

The profile itself becomes the application's identity.

---

# Testing

After each phase verify the following.

---

## Phase 1

* Welcome screen works.
* Profile is created.
* Starter journal is created.
* Starter entry is created.

---

## Phase 2

* Existing journals appear.
* New journals can be created.
* Journals can be deleted.
* Journal selection works.

---

## Phase 3

* Existing entries appear.
* New entries save correctly.
* Entries update.
* Entries delete correctly.
* Search still works.

---

## Phase 4

* Fresh installation works.
* Existing database migrates correctly (if migration is supported).
* Welcome flow works.
* Restarting the application loads existing data.

---

# Acceptance Criteria

The migration is complete when:

* The application no longer creates fake users.
* No code depends on the `users` table.
* Journals no longer store `user_id`.
* Entries no longer store `user_id`.
* Login and signup concepts are fully removed.
* The local profile becomes the only identity in the application.
* All existing journal and entry functionality continues to work.

---

# Future Considerations

Once this migration is complete, the `profile` table can naturally evolve into the application's settings store. Future additions such as theme preferences, storage location, default journal, last opened entry, and editor preferences can all be associated with the single local profile without reintroducing user accounts. This keeps Chapters true to its vision as a simple, local-first journaling application while leaving the door open for optional cloud sync in the future.
