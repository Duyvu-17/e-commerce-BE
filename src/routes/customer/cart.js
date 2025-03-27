import express from "express";
import cartController from "../../controllers/customer/cartController.js"
import authenticateJWT from "../../middleware/authenticateJWT.js";
const router = express.Router();

router.get("/", authenticateJWT, cartController.getCart);
router.post("/", authenticateJWT, cartController.addToCart);
router.put("/:itemId", authenticateJWT, cartController.updateCartItem);
router.delete("/:itemId", authenticateJWT, cartController.removeCartItem);
router.delete("/clear", authenticateJWT, cartController.clearCart);

export default router;
