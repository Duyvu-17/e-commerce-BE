const express = require("express");
const router = express.Router();
const { getOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../../controllers/admin/orderController");

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
