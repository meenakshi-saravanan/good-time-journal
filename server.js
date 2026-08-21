const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const db = require("./database/db");

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.json());

app.get("/", (req, res) => {
  db.get(
    "SELECT id FROM profile WHERE id = 1",
    (err, profile) => {
      if (err) {
        res.redirect("/welcome.html");
        return;
      }

      res.redirect(profile ? "/index.html" : "/welcome.html");
    }
  );
});

app.use(express.static("public"));
app.use("/uploads", express.static(uploadsDir));

const journalRoutes = require("./routes/entries");
const journalsRoutes = require("./routes/journals");
const profileRoutes = require("./routes/profile");
const uploadRoutes = require("./routes/upload");

app.use("/api/profile", profileRoutes);
app.use("/api/journals", journalsRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/login.html", (req, res) => {
  res.redirect("/welcome.html");
});

app.get("/signup.html", (req, res) => {
  res.redirect("/welcome.html");
});

app.get("/templates", (req, res) => {
  res.sendFile("templates.html", { root: "public" });
});

app.get("/journals/new", (req, res) => {
  res.sendFile("new-journal.html", { root: "public" });
});

app.get("/journals/:id", (req, res) => {
  res.sendFile("journal.html", { root: "public" });
});

function startServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, HOST, () => {
      console.log(`Good Time Journal is running at http://${HOST}:${PORT}`);
      resolve(server);
    });

    server.on("error", (err) => {
      console.error(`Unable to start server on ${HOST}:${PORT}`);
      console.error(err.message);
      reject(err);
    });
  });
}

module.exports = {
  app,
  startServer,
  PORT,
  HOST,
};