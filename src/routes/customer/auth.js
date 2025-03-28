import express from "express";
import authController from "../../controllers/authController.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/social-login", authController.socialLogin);
router.post("/forgot-password", authController.customerForgotPassword);
router.post("/reset-password",authController.resetPassword);

export default router;
