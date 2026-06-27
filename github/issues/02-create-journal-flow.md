# Create Journal Flow

## 📖 Overview

Implement the complete flow for creating a new journal. Users should be able to quickly create journals that are persisted locally and immediately available for writing.

---

## 🎯 Goal

Allow users to create and organize multiple journals.

---

## User Story

As a user, I want to create journals so I can organize different aspects of my life separately.

---

## Scope

- Create Journal dialog
- Journal name validation
- Prevent duplicate journal names
- Save journal to SQLite
- Automatically open newly created journal
- Update sidebar without refresh

---

## Acceptance Criteria

- [ ] User can create a journal
- [ ] Duplicate names are prevented
- [ ] Journal appears in sidebar
- [ ] Journal is persisted
- [ ] Newly created journal opens automatically

---

## Technical Notes

- Validate empty names
- Trim whitespace
- SQLite persistence
- Handle database errors gracefully

---

## Definition of Done

- [ ] Code reviewed
- [ ] Tested
- [ ] Database updated correctly
- [ ] No console errors

---

## Dependencies

- Home Page Revamp

---

## Labels

feature, frontend, backend

## Priority

P0

## Effort

Medium

## Milestone

🎯 MVP