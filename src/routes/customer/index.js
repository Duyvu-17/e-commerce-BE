const express = require("express");
const router = express.Router();

// Import các routes con
const authRoutes = require("./auth");
// const customerRoutes = require("./customer");
// const productRoutes = require("./products");
// const cartRoutes = require("./cart");
// const orderRoutes = require("./orders");
// const wishlistRoutes = require("./wishlist");
// const paymentRoutes = require("./payment");
// const shippingRoutes = require("./shipping");

// Sử dụng các routes
router.use("/auth", authRoutes);
// router.use("/users", customerRoutes);
// router.use("/products", productRoutes);
// router.use("/cart", cartRoutes);
// router.use("/orders", orderRoutes);
// router.use("/wishlist", wishlistRoutes);
// router.use("/payment", paymentRoutes);
// router.use("/shipping", shippingRoutes);

module.exports = router;
