import express from "express";
import settingsController from "../../controllers/admin/settingsController.js";

const router = express.Router();

router.get("/", settingsController.getSettings);
router.put("/",  settingsController.updateSettings);

export default router;
