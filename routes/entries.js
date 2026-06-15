const express = require("express");
const entriesController = require("../controllers/entriesController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", entriesController.getEntries);
router.get("/:id", entriesController.getEntry);
router.post("/", entriesController.createEntry);
router.delete("/:id", entriesController.deleteEntry);

module.exports = router;
