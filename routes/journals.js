const express = require("express");
const journalsController = require("../controllers/journalsController");

const router = express.Router();

router.get("/", journalsController.getJournals);
router.post("/", journalsController.createJournal);
router.post("/from-template", journalsController.createFromTemplate);
router.post("/migrate-good-time", journalsController.migrateGoodTimeJournal);
router.put("/:id", journalsController.updateJournal);
router.delete("/:id", journalsController.deleteJournal);
router.get("/:id", journalsController.getJournal);



module.exports = router;
