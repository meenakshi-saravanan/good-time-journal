# Spec 0XX — Local Profile & First Launch Onboarding

## Status

Proposed

---

# Background

Chapters is evolving into a **local-first desktop journaling application** built with Electron.

Unlike cloud-based applications, users are not required to create an account before writing. Authentication introduces unnecessary friction and does not align with the product vision.

Instead, Chapters should provide a lightweight onboarding experience that personalizes the application while keeping all user data on the local device.

---

# Problem Statement

The current application assumes:

* User accounts
* Authentication
* Sessions
* Protected routes

These concepts are unnecessary for a local-first application and increase both UX and technical complexity.

---

# Goal

Replace authentication with a simple local profile.

The application should:

* Ask the user's name only once.
* Store the profile locally.
* Automatically determine whether onboarding has been completed.
* Personalize the application.
* Never require login or signup.

---

# Success Criteria

A first-time user should be able to:

* Launch Chapters.
* Enter their name.
* Start writing immediately.

Returning users should:

* Open directly into the application.
* Never see onboarding again unless the profile is deleted.

---

# Product Principles

The onboarding experience should feel like:

> "Welcome to your personal writing space."

It should never feel like:

> "Create an account."

---

# Scope

## In Scope

* Local profile
* First launch detection
* Welcome page
* Application startup flow
* Personalized greeting
* Removal of authentication

## Out of Scope

* Cloud accounts
* Sync
* Multiple users
* Passwords
* Email verification
* Sessions

---

# Architecture

## Before

```
Launch App

↓

Login

↓

Authentication

↓

Home
```

---

## After

```
Launch App

↓

Profile Exists?

├── Yes
│      ↓
│   Open Chapters
│
└── No
       ↓
Welcome

↓

Create Local Profile

↓

Create Starter Journal

↓

Create Welcome Entry

↓

Open Chapters
```

---

# Database Changes

## New Table

```
profile
```

Columns

| Column       | Type                | Notes                 |
| ------------ | ------------------- | --------------------- |
| id           | INTEGER PRIMARY KEY | Always 1              |
| display_name | TEXT NOT NULL       | User's preferred name |
| created_at   | DATETIME            | Creation timestamp    |

---

## Constraints

Only one profile may exist.

Recommended constraint

```
CHECK (id = 1)
```

---

# API

## GET /api/profile

Returns

```json
{
    "display_name": "Meenakshi"
}
```

If profile does not exist

```
404 Not Found
```

---

## POST /api/profile

Creates the local profile.

Request

```json
{
    "display_name": "Meenakshi"
}
```

Response

```json
{
    "success": true
}
```

This endpoint should only succeed once.

If a profile already exists

```
409 Conflict
```

---

# First Launch

## Condition

No profile exists.

---

## Display

```
Welcome to Chapters

What should we call you?

[______________]

We'll use your name to personalize your journal.

Continue
```

---

## Validation

Display name

* Required
* Trim whitespace
* Maximum 40 characters
* Minimum 1 visible character

---

## Continue Flow

```
Continue

↓

POST /api/profile

↓

Create Starter Journal

↓

Create Welcome Entry

↓

Redirect to Home
```

---

# Returning User

Application startup

```
GET /api/profile

↓

Profile Found

↓

Open Home
```

The Welcome screen should never appear again.

---

# Application Header

Replace

```
Logout
```

with

```
Meenakshi
```

or

```
Hello, Meenakshi
```

A future Settings menu will be accessible from this area.

---

# Authentication Removal

The following concepts should be removed.

## Frontend

* Login page
* Signup page
* Login form
* Signup form
* Authentication checks
* Session validation
* Logout

---

## Backend

* Auth routes
* Auth controller
* Authentication middleware
* Session management
* Cookie handling
* Password hashing

---

## Database

Remove

```
users
```

after the migration is complete.

---

# Startup Logic

Replace

```
requireAuthenticatedUser()
```

with

```
loadProfile()
```

Application initialization becomes

```
Profile exists?

Yes
↓

Load application

No
↓

Welcome screen
```

---

# Error Handling

## Unable to create profile

Display

```
Unable to create your profile.

Please try again.
```

---

## Profile lookup failed

Display

```
Unable to start Chapters.

Please restart the application.
```

---

# Acceptance Criteria

The feature is complete when:

* Login and signup are no longer required.
* The user is only asked for their name.
* A local profile is created.
* Returning users bypass onboarding.
* The application loads successfully without authentication.
* No authentication APIs are required.
* No redirect loops occur.
* The application works fully offline.

---

# Future Extensions

The `profile` table will become the central location for all user preferences.

Possible future fields include:

| Field               | Purpose                    |
| ------------------- | -------------------------- |
| avatar              | Profile image              |
| theme               | Light/Dark/System          |
| accent_color        | UI personalization         |
| storage_location    | Journal storage directory  |
| default_journal     | Preferred journal          |
| last_opened_journal | Restore previous workspace |
| last_opened_entry   | Resume editing             |
| autosave_interval   | Autosave preferences       |
| spellcheck_enabled  | Editor settings            |
| created_at          | Metadata                   |
| updated_at          | Metadata                   |

This keeps the data model simple today while providing a clear path for future personalization without reintroducing user accounts.

---

# Implementation Plan

To minimize risk and keep the application functional throughout the transition, implement this specification in the following order:

### Phase 1 — Welcome Experience

* Repurpose the login page into the Welcome page.
* Replace authentication UI with a display name form.
* Remove authentication checks from the frontend.
* Eliminate redirect loops.

### Phase 2 — Local Profile

* Create the `profile` table.
* Implement `GET /api/profile` and `POST /api/profile`.
* Save the user's display name locally.
* Load the profile during application startup.

### Phase 3 — Starter Content

* Automatically create the **Getting Started** journal after profile creation.
* Automatically create the **Welcome to Chapters** entry with sample content.

### Phase 4 — Authentication Cleanup

* Remove authentication routes, controllers, middleware, and database tables.
* Replace the header greeting with the user's display name.
* Rename remaining authentication-related files and functions (e.g., `login.html` → `welcome.html`, `setupAuthPage()` → `setupWelcomePage()`).

This staged rollout keeps the application operational after every milestone while progressively transitioning Chapters into a true local-first journaling application.
