
import express from "express";
import profileUpload from "../../middleware/profileUpload.js";
import authController from "../../controllers/admin/authController.js";

const router = express.Router();
router.put("/", profileUpload.single("avatar"), authController.updateProfile);
router.post("/change-password", authController.changePassword);

export default router;
