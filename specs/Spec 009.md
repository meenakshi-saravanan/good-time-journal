# Feature Spec: Add TipTap Rich Text Editor for Journal Notes

## Status

Proposed

---

# Background

Chapters currently uses a standard HTML textarea for journal notes.

```text
Notes
[ textarea ]
```

This limits the writing experience and prevents users from formatting longer journal entries.

As Chapters evolves into a multi-journal platform, users should have access to a modern writing experience.

---

# Goal

Replace the Notes textarea with a TipTap rich text editor.

Users should be able to:

* Write formatted journal entries
* Create headings
* Use bold and italic text
* Create bullet and numbered lists
* Add links
* Preserve formatting when viewing entries

---

# Scope

This iteration only upgrades the Notes field.

No AI features.

No collaboration.

No image uploads.

No tables.

No code blocks.

---

# Technical Stack

Current:

```text
Node.js
Bootstrap 5
Vanilla JavaScript
SQLite
```

New:

```text
Node.js
Bootstrap 5
Vanilla JavaScript
SQLite
TipTap
```

---

# Installation

Install TipTap packages:

```bash
npm install @tiptap/core
npm install @tiptap/starter-kit
```

or

```bash
npm install @tiptap/core @tiptap/starter-kit
```

---

# Entry Creation Page

## Current

```html
<label>Notes</label>

<textarea
  id="notes"
></textarea>
```

---

## New

Replace textarea with:

```html
<div class="mb-4">

  <label class="form-label">
    Journal Notes
  </label>

  <div
    id="editor"
    class="tiptap-editor"
  ></div>

  <input
    type="hidden"
    id="notes"
  >

</div>
```

---

# Editor Initialization

## New File

Create:

```text
public/js/editor.js
```

---

## Initialize TipTap

Create a global editor instance:

```javascript
window.notesEditor
```

The editor should:

* Load when the entry form page loads
* Be available to the existing form submission flow
* Use StarterKit

---

# Supported Formatting

Enable:

```text
Paragraphs
Headings
Bold
Italic
Bullet Lists
Numbered Lists
Blockquotes
Horizontal Rules
Links
```

---

# Unsupported Formatting

Do not enable:

```text
Images
Tables
Embeds
Code Blocks
Collaboration
AI Commands
Mentions
Comments
```

---

# Save Flow

## Current

Inside:

```javascript
submitForm()
```

the notes field is saved using:

```javascript
document.getElementById("notes").value
```

---

## Required Change

Replace with:

```javascript
window.notesEditor.getHTML()
```

---

## Expected Result

Example editor content:

```html
<h2>Morning Walk</h2>

<p>
Felt energetic today.
</p>

<ul>
  <li>Good weather</li>
  <li>High energy</li>
</ul>
```

should be stored in the database exactly as HTML.

---

# Database

No schema changes required.

Existing:

```text
notes TEXT
```

can continue to be used.

---

# View Entry Page

## Current Behavior

Entry notes are rendered as plain text.

Examples may include:

```javascript
textContent
```

or

```javascript
innerText
```

---

## Required Change

Render saved notes using:

```javascript
innerHTML
```

instead of:

```javascript
textContent
```

---

# Investigation Required

Search the codebase for:

```text
renderEntryDetail(
```

and:

```text
entry.notes
```

Identify all locations where notes are rendered.

Update them to support HTML output.

---

# Entry Detail Experience

## Before

```text
Morning Walk

Felt energetic today.

Good weather
High energy
```

Formatting is lost.

---

## After

```text
Morning Walk

Felt energetic today.

• Good weather
• High energy
```

Formatting is preserved.

---

# Styling

## New CSS

Add:

```css
.tiptap-editor {
  min-height: 300px;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fff;
}

.tiptap-editor .ProseMirror {
  min-height: 250px;
  outline: none;
}
```

---

# Acceptance Criteria

✅ Notes textarea replaced with TipTap editor

✅ TipTap loads successfully

✅ Users can create formatted content

✅ HTML is saved to the database

✅ Existing save flow continues to work

✅ Existing database schema remains unchanged

✅ Journal detail page displays formatting correctly

✅ Headings, bold, italic, lists and links are supported

✅ No image uploads

✅ No tables

✅ No AI features

✅ Existing Good Time Journal functionality remains intact

---

# Out of Scope

Not included in this iteration:

* AI writing assistance
* Slash commands
* Collaboration
* Comments
* Image uploads
* File attachments
* Journal templates
* Rich text editing in journal titles
