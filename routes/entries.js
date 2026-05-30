const express = require("express");
const entriesController = require("../controllers/entriesController");

const router = express.Router();

router.get("/", entriesController.getEntries);
router.post("/", entriesController.createEntry);
router.delete("/:id", entriesController.deleteEntry);

module.exports = router;
