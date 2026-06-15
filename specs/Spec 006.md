# Spec 006 — Authentication and Multi-User Support

## Status

Proposed

---

# Background

Good Time Journal currently operates as a single-user application.

All journal entries are stored in a shared table and are visible to anyone accessing the application.

As the application grows, users need private accounts and ownership of their journal entries.

---

# Problem Statement

The application currently lacks:

* User authentication
* User accounts
* Ownership of journal entries
* Access control

As a result:

* Any user can see all journal entries
* Entries are not associated with a specific user
* User privacy is not maintained

---

# Goal

Introduce authentication and user ownership of journal entries.

Users should be able to:

* Sign up
* Log in
* Log out
* Create journal entries
* View only their own journal entries
* View only their own journal details
* Delete only their own journal entries

---

# Success Criteria

Users can:

* Create an account
* Log in successfully
* Remain logged in via session
* Create journal entries
* See only their own entries
* Access only their own entries
* Delete only their own entries
* Log out successfully

---

# Architecture Impact

## Current Architecture

User

↓

Journal Entries

All users share:

```sql
journal_entries
```

---

## Proposed Architecture

User

↓

Account

↓

Journal Entries

Each journal entry belongs to exactly one user.

Example:

User A

* Entry 1
* Entry 2

User B

* Entry 3
* Entry 4

---

# Scope

## In Scope

* User signup
* User login
* User logout
* Session management
* User ownership of journal entries
* User-specific journal entry filtering
* Protection of journal APIs
* User-specific entry deletion

## Out of Scope

* Social login
* Password reset
* Email verification
* Two-factor authentication
* User profile editing
* Multi-device session management

---

# User Stories

## Signup

As a new user,

I want to create an account,

So that I can securely store my journal entries.

---

## Login

As an existing user,

I want to log in,

So that I can access my journal entries.

---

## Privacy

As a user,

I want to see only my own journal entries,

So that my personal reflections remain private.

---

## Ownership

As a user,

I want my journal entries associated with my account,

So that other users cannot access them.

---

# Database Changes

## New Table

### users

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Update Existing Table

### journal_entries

Add:

```sql
user_id INTEGER NOT NULL
```

and

```sql
FOREIGN KEY(user_id)
REFERENCES users(id)
```

---

## Updated Schema

### journal_entries

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
user_id INTEGER NOT NULL
entry_date TEXT NOT NULL
activity TEXT NOT NULL
energy INTEGER
engagement INTEGER
notes TEXT
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

# Authentication Strategy

Use:

```text
Express Session
```

for authentication.

Benefits:

* Simpler implementation
* Server-side session management
* No token storage in frontend
* Appropriate for small-to-medium applications

---

# Dependencies

Install:

```bash
npm install express-session
npm install bcrypt
```

---

# API Requirements

## Signup

### Endpoint

```http
POST /api/auth/signup
```

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "Account created successfully"
}
```

---

## Login

### Endpoint

```http
POST /api/auth/login
```

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "Login successful"
}
```

---

## Logout

### Endpoint

```http
POST /api/auth/logout
```

### Success Response

```json
{
  "message": "Logout successful"
}
```

---

## Current User

### Endpoint

```http
GET /api/auth/me
```

### Response

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

# Middleware Requirements

## Authentication Middleware

Create:

```text
middleware/auth.js
```

Purpose:

* Verify session exists
* Verify authenticated user
* Block unauthenticated access

If session is missing:

```http
401 Unauthorized
```

---

# Journal Entry Requirements

## Journal List

Current behavior:

Returns all entries.

### New behavior

Return only entries belonging to:

```text
req.session.userId
```

---

## Journal Detail

Current behavior:

Lookup by entry ID.

### New behavior

Lookup by:

```text
entry ID
+
logged-in user ID
```

---

## Create Entry

Current behavior:

Creates a journal entry.

### New behavior

Creates a journal entry associated with:

```text
req.session.userId
```

---

## Delete Entry

Current behavior:

Deletes entry by ID.

### New behavior

Deletes entry only if:

```text
entry.user_id === req.session.userId
```

---

# Frontend Changes

## New Pages

### signup.html

Fields:

* Name
* Email
* Password
* Create Account Button

---

### login.html

Fields:

* Email
* Password
* Login Button

---

# Navigation Flow

## Current

Open App

↓

Journal List

---

## New

Open App

↓

Check Session

↓

Authenticated?

├── No → Login Page

└── Yes → Journal List

---

# Header Changes

Display:

```text
Welcome, {User Name}
Logout
```

on authenticated pages.

---

# Security Requirements

## Password Storage

Passwords shall never be stored in plain text.

Passwords must be hashed using:

```text
bcrypt
```

---

## Access Control

Users shall not:

* View another user's entries
* Delete another user's entries
* Access another user's journal detail page

---

## Session Protection

All journal endpoints shall require authentication.

Protected endpoints:

```http
GET /api/journal
GET /api/journal/:id
POST /api/journal
DELETE /api/journal/:id
```

---

# Migration Strategy

## Option A (Recommended)

Delete existing development database:

```text
journal.db
```

Recreate database using updated schema.

Recommended because the application is still in an early stage.

---

## Option B

Create migration script:

```sql
ALTER TABLE journal_entries
ADD COLUMN user_id INTEGER;
```

Then manually assign ownership.

---

# Acceptance Criteria

Given a user signs up

When account creation succeeds

Then the user is authenticated.

---

Given a user logs in

When credentials are valid

Then the user can access the application.

---

Given a logged-in user creates an entry

When the entry is saved

Then the entry is associated with that user.

---

Given multiple users exist

When a user views the journal list

Then only their own entries are displayed.

---

Given a user opens a journal entry

When the entry belongs to them

Then the entry is displayed.

---

Given a user attempts to access another user's entry

When access is checked

Then the request is denied.

---

Given a user deletes a journal entry

When the entry belongs to them

Then the entry is removed successfully.

---

Given a user logs out

When logout completes

Then the session is destroyed.

---

# Risks

* Existing journal data must be migrated or recreated.
* Authentication introduces additional backend complexity.
* Session management requires proper configuration in production.

---

# Future Opportunities

After authentication is complete:

* Edit Journal Entry
* Forgot Password
* Email Verification
* User Profile
* Journal Analytics Dashboard
* CSV Export
* Journal Streak Tracking
* Multi-device Sessions
* OAuth Login (Google, Apple)

---

# Recommended Release Plan

## Release 1

* Signup
* Login
* Logout
* Session Management
* User-Owned Journal Entries

## Release 2

* Forgot Password
* Email Verification
* Profile Management

This phased approach minimizes risk while delivering immediate user privacy and ownership.
