import express from "express";
import orderController from "../controllers/orderController.js"; 

const router = express.Router();

export default router;


router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.put("/:id/cancel", orderController.cancelOrder);
router.get("/admin/orders", orderController.getAllOrders);
router.put("/admin/orders/:id/status", orderController.updateOrderStatus);

module.exports = router;
