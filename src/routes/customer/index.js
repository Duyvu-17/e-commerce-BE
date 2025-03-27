import express from "express";
import authRoutes from "./auth.js";
import customerRoutes from "./customer.js";
import productRoutes from "./products.js";
import cartRoutes from "./cart.js";
// import orderRoutes from "./orders.js";
// import wishlistRoutes from "./wishlist.js";
// import paymentRoutes from "./payment.js";
// import shippingRoutes from "./shipping.js";

const router = express.Router();

// Sử dụng các routes
router.use("/auth", authRoutes);
router.use("/customer", customerRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
// router.use("/orders", orderRoutes);
// router.use("/wishlist", wishlistRoutes);
// router.use("/payment", paymentRoutes);
// router.use("/shipping", shippingRoutes);

export default router;
