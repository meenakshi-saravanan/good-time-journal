const express = require("express");
const journalsController = require("../controllers/journalsController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", journalsController.getJournals);
router.post("/", journalsController.createJournal);
router.post("/from-template", journalsController.createFromTemplate);
router.post("/migrate-good-time", journalsController.migrateGoodTimeJournal);
router.get("/:id", journalsController.getJournal);

module.exports = router;
