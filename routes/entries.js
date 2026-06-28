console.log("✅ entries.js loaded");
const express = require("express");
const entriesController = require("../controllers/entriesController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

router.use(requireAuth);

router.get("/", entriesController.getEntries);
router.get("/:id", entriesController.getEntry);
router.post("/", entriesController.createEntry);
router.put("/:id", entriesController.updateEntry);
router.delete("/:id", entriesController.deleteEntry);

module.exports = router;
