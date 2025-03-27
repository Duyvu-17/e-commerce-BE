import express from "express";
import wishlistController from "../controllers/wishlistController.js";
const router = express.Router();


router.get("/", wishlistController.getWishlist);
router.post("/:productId", wishlistController.addToWishlist);
router.delete("/:productId", wishlistController.removeFromWishlist);

module.exports = router;
