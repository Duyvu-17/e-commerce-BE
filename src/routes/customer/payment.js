import express from "express";
import paymentController from "../controllers/paymentController.js"; // Thêm .js

const router = express.Router();


router.get("/methods", paymentController.getPaymentMethods);
router.post("/methods", paymentController.addPaymentMethod);
router.delete("/methods/:id", paymentController.removePaymentMethod);

module.exports = router;
