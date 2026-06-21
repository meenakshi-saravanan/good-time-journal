# Good Time Journal - Architecture Overview

## Purpose

Good Time Journal helps users record activities and measure how meaningful they felt through Energy and Engagement ratings.

## Technology Stack

### Frontend
- HTML
- Bootstrap 5
- Vanilla JavaScript

### Backend
- Node.js
- Express 5

### Database
- SQLite

## Application Flow

Browser
→ app.js
→ api.js
→ Express Route
→ Controller
→ SQLite Database

## Folder Structure

server.js
routes/
controllers/
database/
public/
  js/
  css/

## Current Features

- Create journal entry
- View journal entries
- View single journal entry
- Delete journal entry

## Future Features

- Authentication
- User-specific journals
- Search
- Analytics dashboard
- Activity insights
- AI-powered reflections