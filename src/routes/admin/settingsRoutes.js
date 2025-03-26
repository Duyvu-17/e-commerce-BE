const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../../controllers/admin/settingsController");


router.get("/", getSettings);
router.put("/",  updateSettings);

module.exports = router;
