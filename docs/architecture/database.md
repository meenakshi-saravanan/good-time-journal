# Database Documentation

## Database Engine

SQLite

## Current Tables

### journal_entries

| Column | Type | Description |
|----------|----------|----------|
| id | INTEGER | Primary key |
| entry_date | TEXT | Journal date |
| activity | TEXT | Activity name |
| energy | INTEGER | Energy rating (1-5) |
| engagement | INTEGER | Engagement rating (1-5) |
| notes | TEXT | User notes |
| created_at | DATETIME | Record creation timestamp |

## Relationships

Currently there are no foreign key relationships.

## Future Database Changes

Authentication will require:

### users

- id
- email
- password_hash
- created_at

### journal_entries

Add:

- user_id

This will ensure each user can only access their own journal entries.