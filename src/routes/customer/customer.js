const router = express.Router();
import express from "express";
import userController from "../controllers/userController.js";

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.get("/", userController.getAllUsers);

module.exports = router;
