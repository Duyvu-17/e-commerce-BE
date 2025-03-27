import express from "express";
import shippingController from "../controllers/shippingController.js";
const router = express.Router();


router.get("/addresses", shippingController.getAddresses);
router.post("/addresses", shippingController.addAddress);
router.put("/addresses/:id", shippingController.updateAddress);
router.delete("/addresses/:id", shippingController.deleteAddress);

module.exports = router;
