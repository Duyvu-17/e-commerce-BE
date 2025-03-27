import express from "express";
import orderController from "../../controllers/admin/orderController.js";

const router = express.Router();

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

export default router;
