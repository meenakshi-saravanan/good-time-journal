const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get("/", profileController.getProfile);
router.post("/", profileController.createProfile);

module.exports = router;
