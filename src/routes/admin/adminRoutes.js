const express = require("express");
const adminRoutes = express.Router();

const { login, register } = require("../../controllers/admin/authController");
const customerRoutes = require("./customerRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const categoryRoutes = require("./categoryRoutes");
const settingsRoutes = require("./settingsRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const { adminMiddleware, authMiddleware } = require("../../middleware/authMiddleware");

// 🔹 Các route này KHÔNG cần xác thực
adminRoutes.post("/login", login);
adminRoutes.post("/register", register);
adminRoutes.post("/register", register);

// 🔹 Các route dưới đây yêu cầu xác thực
adminRoutes.use(authMiddleware); 
adminRoutes.use(adminMiddleware);

adminRoutes.use("/customers", customerRoutes);
adminRoutes.use("/products", productRoutes);
adminRoutes.use("/orders", orderRoutes);
adminRoutes.use("/categories", categoryRoutes);
adminRoutes.use("/settings", settingsRoutes);
adminRoutes.use("/dashboard", dashboardRoutes);

module.exports = adminRoutes;
