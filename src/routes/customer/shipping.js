const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");

router.get("/addresses", shippingController.getAddresses);
router.post("/addresses", shippingController.addAddress);
router.put("/addresses/:id", shippingController.updateAddress);
router.delete("/addresses/:id", shippingController.deleteAddress);

module.exports = router;
