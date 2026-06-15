# Spec 005 — Delete Journal Entry

## Status

Proposed

---

# Background

Users can create journal entries and review them from the journal list and journal detail page.

As the journal grows, users may need to remove entries that were created by mistake, duplicated, or no longer useful.

Deleting a journal entry is a destructive action and should be handled carefully.

---

# Problem Statement

The application does not currently provide a clear way to delete one specific journal entry from the journal list or detail view.

Users need a reliable delete option that:

* Targets only the selected entry
* Prevents accidental deletion
* Updates the UI after deletion
* Preserves all other journal entries

---

# Goal

Add a delete option for a specific journal entry.

Users should be able to delete an individual journal entry from the journal detail page, with confirmation before the entry is permanently removed.

---

# Success Criteria

Users can:

* Open a specific journal entry
* Choose to delete that entry
* Confirm the delete action
* Return to the journal list after successful deletion
* See that the deleted entry no longer appears in the journal list

---

# Scope

## In Scope

* Add Delete action to journal detail page
* Add confirmation before deletion
* Add API endpoint for deleting one journal entry
* Remove the entry from the database
* Redirect user after successful deletion
* Display error messaging when deletion fails

## Out of Scope

* Bulk delete
* Soft delete
* Restore deleted entries
* Delete from table row
* Audit history
* Authentication or authorization

---

# User Story

As a user maintaining a Good Time Journal,

I want to delete a specific journal entry,

So that I can remove entries that were added by mistake or are no longer needed.

---

# UX Changes

## Journal Detail Page

### Current

Journal detail page displays:

* Back to Recent Entries
* Activity
* Date
* Energy
* Engagement
* Notes

---

### Proposed

Journal detail page displays:

* Back to Recent Entries
* Activity
* Date
* Energy
* Engagement
* Notes
* Delete action

---

## Delete Action

Delete action should be visually distinct as a destructive action.

Recommended Bootstrap style:

```html
<button class="btn btn-danger">
  Delete
</button>
```

---

## Confirmation

When user clicks Delete, system shall ask for confirmation before deleting the entry.

Recommended confirmation copy:

```text
Are you sure you want to delete this journal entry?
```

Confirmation options:

* Cancel
* Delete

Cancel should dismiss the confirmation and keep the user on the journal detail page.

Delete should permanently remove the selected journal entry.

---

# Functional Requirements

## FR-1 Delete Action Display

System shall display a Delete action on the journal detail page.

---

## FR-2 Delete Confirmation

When user clicks Delete,

System shall show a confirmation prompt before deleting the entry.

---

## FR-3 Cancel Delete

When user cancels the confirmation,

System shall keep the journal entry unchanged.

---

## FR-4 Confirm Delete

When user confirms deletion,

System shall send a delete request for the selected journal entry ID.

---

## FR-5 Delete Persistence

System shall remove only the selected journal entry from the database.

---

## FR-6 Post-Delete Navigation

After successful deletion,

System shall redirect user to:

```text
/
```

or

```text
/index.html
```

---

## FR-7 Deleted Entry Removal

After deletion,

System shall not display the deleted entry in the journal list.

---

## FR-8 Delete Failure Handling

If deletion fails,

System shall keep the user on the journal detail page and display an error message.

---

# Data Requirements

No database schema changes required.

Existing table:

```sql
journal_entries
```

contains the entry ID needed for deletion.

---

# API Requirements

## New Endpoint

```http
DELETE /api/journal/:id
```

Deletes a single journal entry by ID.

---

## Success Response

```json
{
  "message": "Journal entry deleted successfully"
}
```

---

## Not Found Response

If the entry does not exist:

```http
404 Not Found
```

```json
{
  "error": "Journal entry not found"
}
```

---

# Technical Requirements

## TR-1 Route Handler

Server shall add a delete route for journal entries.

Recommended route:

```javascript
router.delete("/:id", deleteEntry);
```

---

## TR-2 Controller Logic

Controller shall:

* Read entry ID from request params
* Delete matching entry from database
* Return success response when a row is deleted
* Return 404 when no matching row exists

---

## TR-3 Client Delete Request

Journal detail page shall call:

```javascript
fetch(`/api/journal/${entryId}`, {
  method: "DELETE"
});
```

---

## TR-4 Button Styling

Delete button shall use Bootstrap danger styling.

Recommended:

```html
<button class="btn btn-danger">
  Delete
</button>
```

---

## TR-5 Error Message Styling

Delete failure message shall use Bootstrap alert styling.

Recommended:

```html
<div class="alert alert-danger">
  Unable to delete journal entry. Please try again.
</div>
```

---

# Non-Functional Requirements

## NFR-1 Safety

System shall require confirmation before deleting an entry.

---

## NFR-2 Specificity

System shall delete only the journal entry identified by the selected entry ID.

---

## NFR-3 Usability

Delete action shall be easy to find on the detail page but visually marked as destructive.

---

# Acceptance Criteria

Given user is viewing a journal entry

When the page loads

Then a Delete action is displayed.

---

Given user clicks Delete

When confirmation appears and user clicks Cancel

Then the entry remains unchanged.

---

Given user clicks Delete

When confirmation appears and user confirms Delete

Then the selected entry is removed from the database.

---

Given user confirms Delete

When deletion succeeds

Then user is redirected to the journal list.

---

Given user returns to the journal list after deletion

When entries are displayed

Then the deleted entry is not shown.

---

Given deletion fails

When the system receives an error response

Then user remains on the journal detail page and sees an error message.

---

# Risks

Because deletion is permanent, accidental deletion may cause data loss.

This risk is reduced by requiring confirmation before deleting an entry.

---

# Future Opportunities

After this change:

* Delete from journal list row
* Soft delete
* Restore deleted entries
* Bulk delete
* Confirmation modal instead of browser confirmation
* Authentication-based delete permissions
