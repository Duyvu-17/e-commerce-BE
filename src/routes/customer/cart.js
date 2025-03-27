import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/:itemId", cartController.updateCartItem);
router.delete("/:itemId", cartController.removeCartItem);
router.delete("/clear", cartController.clearCart);

module.exports = router;
