const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.put("/:id/cancel", orderController.cancelOrder);
router.get("/admin/orders", orderController.getAllOrders);
router.put("/admin/orders/:id/status", orderController.updateOrderStatus);

module.exports = router;
