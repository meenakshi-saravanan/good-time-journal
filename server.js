const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.use(express.json());
app.use(express.static("public"));

const journalRoutes = require("./routes/entries");

app.use("/api/journal", journalRoutes);

const server = app.listen(PORT, HOST, () => {
  console.log(`Good Time Journal is running at http://${HOST}:${PORT}`);
});

server.on("error", (err) => {
  console.error(`Unable to start server on ${HOST}:${PORT}`);
  console.error(err.message);
  process.exit(1);
});
