const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/methods", paymentController.getPaymentMethods);
router.post("/methods", paymentController.addPaymentMethod);
router.delete("/methods/:id", paymentController.removePaymentMethod);

module.exports = router;
