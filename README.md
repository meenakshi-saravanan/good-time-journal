# 📓 Good Time Journal

A simple journaling application that helps you discover which activities consistently generate the highest levels of energy and engagement.

Good Time Journal goes beyond traditional journaling by capturing not only what you did, but also how that activity made you feel. Over time, this creates a personal dataset that can help identify meaningful patterns and improve day-to-day decision making.

---

## ✨ Highlights

- Record daily activities and reflections
- Rate Energy and Engagement on a 1–5 scale
- View historical journal entries
- Review detailed entry information
- Delete entries you no longer need
- Lightweight architecture with SQLite and Express
- Beginner-friendly codebase

---

## 🚀 Why Good Time Journal?

Many journaling apps focus on writing.

Good Time Journal focuses on understanding.

Instead of asking only:

> What did I do today?

Good Time Journal also asks:

> Did this activity energize me?
>
> Was I engaged while doing it?

Over time, users can identify activities that consistently contribute to a better day and reduce time spent on activities that drain energy.

---

## 🏗️ Architecture

### Frontend

- HTML
- Bootstrap 5
- Vanilla JavaScript

### Backend

- Node.js
- Express 5

### Database

- SQLite

### Application Flow

Browser
→ Frontend Pages
→ API Calls
→ Express Routes
→ Controllers
→ SQLite Database

---

## 📂 Project Structure

```text
server.js
routes/
controllers/
database/
public/
├── css/
├── js/
├── index.html
├── new-entry.html
└── journal-entry.html

docs/
```

---

## 📸 Features

### Create Journal Entry

Capture:

- Date
- Activity
- Energy Rating
- Engagement Rating
- Notes

### View Journal Entries

Browse all entries in reverse chronological order.

### Entry Detail View

Review complete information for an individual journal entry.

### Delete Journal Entry

Remove entries that were created accidentally or are no longer useful.

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/meenakshi-saravanan/good-time-journal.git
cd good-time-journal
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/journal | Get all journal entries |
| GET | /api/journal/:id | Get a specific entry |
| POST | /api/journal | Create a journal entry |
| DELETE | /api/journal/:id | Delete a journal entry |

---

## 🗄️ Database Schema

### journal_entries

| Column | Type |
|----------|----------|
| id | INTEGER |
| entry_date | TEXT |
| activity | TEXT |
| energy | INTEGER |
| engagement | INTEGER |
| notes | TEXT |
| created_at | DATETIME |

---

## 🛣️ Roadmap

### Phase 1

- Journal CRUD
- Entry detail page
- Delete entries

### Phase 2

- User authentication
- Login and signup
- Session management
- User-specific journals

### Phase 3

- Search and filtering
- Edit journal entries
- Analytics dashboard

### Phase 4

- Activity insights
- Energy trends
- Engagement trends

### Phase 5

- AI-generated reflections
- Weekly summaries
- Personalized recommendations

---

## 📚 Documentation

Project documentation lives inside:

```text
docs/
```

Including:

- Architecture
- Database documentation
- API documentation
- Product roadmap

---

## 🤝 Contributing

Contributions, ideas, feature requests, and feedback are welcome.

If you find a bug or have an improvement suggestion, please open an issue.

---

## 👨‍💻 Author

Meenakshi Saravanan

Senior UX Designer exploring product development, journaling systems, and AI-powered tools.

---

## ⭐ Support

If you find this project useful, consider giving the repository a star.

It helps others discover the project and supports future development.