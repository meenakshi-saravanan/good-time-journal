const express = require("express");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "good-time-journal-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax"
    }
  })
);
app.use(express.static("public"));

const journalRoutes = require("./routes/entries");
const authRoutes = require("./routes/auth");
const journalsRoutes = require("./routes/journals");

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalsRoutes);
app.use("/api/journal", journalRoutes);

app.get("/templates", (req, res) => {
  res.sendFile("templates.html", { root: "public" });
});

app.get("/journals/new", (req, res) => {
  res.sendFile("new-journal.html", { root: "public" });
});

app.get("/journals/:id", (req, res) => {
  res.sendFile("journal.html", { root: "public" });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Good Time Journal is running at http://${HOST}:${PORT}`);
});

server.on("error", (err) => {
  console.error(`Unable to start server on ${HOST}:${PORT}`);
  console.error(err.message);
  process.exit(1);
});
