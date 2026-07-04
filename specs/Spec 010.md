# Spec 0XX — Empty States, Loading States & UX Edge Cases

## Status

Proposed

---

# Background

As Chapters grows beyond a simple journaling application into a full writing environment, the experience should remain predictable and polished regardless of the amount of content a user has.

Currently, the application primarily supports the happy path where journals and entries already exist.

The application should gracefully handle empty data, loading, errors, long-running operations, and uncommon user interactions.

---

# Problem Statement

The current application lacks standardized handling for:

* Empty journals
* Empty entry lists
* Search results
* Loading states
* Error states
* Deleted content
* Large datasets
* Editor edge cases
* Responsive layouts

This can make the application feel unfinished even when the underlying functionality works correctly.

---

# Goal

Create a consistent UX system for handling:

* Empty states
* Loading states
* Error states
* Edge cases
* Recovery flows

across the entire application.

---

# Success Criteria

The application should never leave the user wondering:

* What happened?
* What should I do next?
* Is my work saved?
* Why is this page empty?

Every state should communicate clearly.

---

# Scope

## In Scope

* Application empty states
* Journal empty states
* Entry empty states
* Search states
* Loading states
* Save states
* Error states
* Delete states
* Responsive edge cases
* Performance considerations

## Out of Scope

* AI writing suggestions
* Collaboration
* Offline synchronization
* Version history

---

# UX Requirements

---

# Section 1 — Application States

## APP-1 First Launch

### Condition

User has:

* No journals
* No entries

### Display

```
Welcome to Chapters

Start your first journal.

[ Create Journal ]
```

---

## APP-2 Loading

Display skeleton loading instead of blank panels for:

* Sidebar
* Entry list
* Editor

---

## APP-3 Offline (Future)

Display

```
You're offline.

Changes will sync when you're back online.
```

---

# Section 2 — Journal Sidebar

## JOURNAL-1 No Journals

Display

```
No journals yet

Create your first journal.
```

---

## JOURNAL-2 Large Number of Journals

When journals exceed viewport height

System shall:

* Scroll internally
* Keep "My Journals" header fixed

---

## JOURNAL-3 Long Journal Names

Long names shall

* truncate
* show full name on hover

Example

```
My Personal Reflection...
```

---

## JOURNAL-4 Duplicate Journal Names

Application shall continue functioning correctly.

(No UX change required.)

---

## JOURNAL-5 Deleted Selected Journal

After deletion

Application shall

* automatically select another journal

or

* show empty state.

---

# Section 3 — Entry List

## ENTRY-1 No Entries

Display

```
No entries yet

Start writing your first entry.

[ New Entry ]
```

---

## ENTRY-2 Internal Scrolling

The entry list shall scroll independently.

The overall page shall remain fixed.

---

## ENTRY-3 Search With No Results

Display

```
No entries found

Try another keyword.

[ Clear Search ]
```

---

## ENTRY-4 Long Titles

Titles shall truncate to one line.

---

## ENTRY-5 No Preview

If no preview text exists

Display

```
No preview available
```

---

## ENTRY-6 Image Only Entry

Display preview as

```
📷 Image
```

---

## ENTRY-7 Untitled Entry

Display

```
Untitled
```

---

## ENTRY-8 Large Number of Entries

Entry list shall support

* smooth scrolling
* future virtualization

---

## ENTRY-9 Deleted Selected Entry

After deletion

Application shall automatically

* select next entry

otherwise

* previous entry

otherwise

* show empty state.

---

# Section 4 — Search

## SEARCH-1 Empty Search

Clearing search shall restore all entries.

---

## SEARCH-2 Space-only Search

Whitespace-only searches shall behave as empty search.

---

## SEARCH-3 Case Insensitive

Search shall ignore letter case.

---

## SEARCH-4 Live Results

Results shall update immediately while typing.

---

# Section 5 — Editor

## EDITOR-1 No Entry Selected

Display

```
Select an entry

or

Create a new one.
```

---

## EDITOR-2 New Entry

Cursor shall automatically receive focus.

---

## EDITOR-3 Empty Entry

Placeholder

```
Start writing...
```

---

## EDITOR-4 Image Only Entry

Entry shall save correctly.

---

## EDITOR-5 Whitespace Only

Application shall not create accidental Untitled entries.

---

## EDITOR-6 Large Images

Images shall

* fit editor width
* never overflow

---

## EDITOR-7 Broken Images

Display

```
Image unavailable
```

instead of browser broken image.

---

## EDITOR-8 Uploading Images

While uploading

* Disable upload button
* Show spinner

---

## EDITOR-9 Upload Failure

Display

```
Unable to upload image.

Try again.
```

---

## EDITOR-10 Autosave Status

Display

```
Saving...
```

then

```
Saved
```

or

```
Save failed
```

---

## EDITOR-11 Delete Current Entry

After deletion

Automatically open another available entry.

---

# Section 6 — Toolbar

## TOOLBAR-1 Editor Not Ready

Disable formatting controls.

---

## TOOLBAR-2 Undo

Disable when unavailable.

---

## TOOLBAR-3 Redo

Disable when unavailable.

---

# Section 7 — New Entry

## NEW-1 Unsaved Changes

If user attempts to create another entry

Prompt

```
Discard current changes?

Cancel

Create New
```

---

# Section 8 — Delete Flow

## DELETE-1 Confirmation

Display confirmation dialog.

---

## DELETE-2 Delete Last Entry

Display

```
No entries

Create your first entry.
```

---

# Section 9 — Keyboard

Support

* Enter
* Shift+Enter
* Ctrl/Cmd+S
* Ctrl/Cmd+K
* Esc

---

# Section 10 — Responsive Layout

## Desktop

Editor width should remain readable.

---

## Narrow Window

Panels shall resize gracefully.

---

# Section 11 — Performance

Application should remain responsive with

* 100 entries
* 500 entries
* 1000 entries

Architecture should allow future virtualization.

---

# Section 12 — Recovery

After refresh

Restore

* Selected journal
* Selected entry
* Scroll position (future)
* Cursor position (future)

---

# Error Handling

Every async operation shall have

Loading

↓

Success

↓

Failure

states.

Operations include

* Loading journals
* Loading entries
* Loading editor
* Saving
* Uploading images
* Creating journal
* Creating entry
* Deleting journal
* Deleting entry

---

# Non-Functional Requirements

The application shall:

* Never display blank panels without explanation.
* Always provide a next action.
* Never silently fail.
* Keep layout stable during loading.
* Avoid layout shifts.
* Remain responsive under large datasets.

---

# Acceptance Criteria

The feature is considered complete when:

* Every panel has an empty state.
* Every async action has loading and error feedback.
* Entry list scrolls independently.
* Long names truncate correctly.
* Deleted selections recover gracefully.
* Autosave communicates status.
* Search behaves predictably.
* Layout remains stable across all supported viewport sizes.
* The application contains no unexplained blank states.

---

# Future Opportunities

Once these UX foundations are complete, Chapters will be well-positioned for richer capabilities without requiring major redesigns:

* Virtualized entry lists for very large journals.
* Pinned and favorite entries.
* Recent entries section.
* Split-view editing.
* Tabs for multiple open entries.
* AI-assisted writing prompts and summaries.
* Offline editing with background synchronization.
* Version history and restore points.
* Drag-and-drop journal organization.
* Command palette and advanced keyboard navigation.

This specification focuses on creating a robust, predictable experience where every state of the application is intentional and informative, providing a solid foundation for future enhancements.
