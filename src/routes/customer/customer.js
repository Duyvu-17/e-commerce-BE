const router = express.Router();
import express from "express";
import customerController from "../../controllers/customer/customerController.js";
import authenticateJWT from "../../middleware/authenticateJWT.js";

router.get("/profile", authenticateJWT , customerController.getProfile);
router.put("/profile", authenticateJWT , customerController.updateProfile);

export default router;
