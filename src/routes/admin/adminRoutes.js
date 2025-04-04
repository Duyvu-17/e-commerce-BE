import express from "express";
import authController from "../../controllers/admin/authController.js";
import customerRoutes from "./customerRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import  Middleware from "../../middleware/authMiddleware.js";

const adminRoutes = express.Router();


// 🔹 Các route này KHÔNG cần xác thực
adminRoutes.post("/login", authController.login);
adminRoutes.post("/register", authController.register);
adminRoutes.post("/verify-Token", authController.verifyToken);
adminRoutes.post("/logout", authController.logout);

// 🔹 Các route dưới đây yêu cầu xác thực
adminRoutes.use(Middleware.authMiddleware); 
adminRoutes.use(Middleware.adminMiddleware);

adminRoutes.use("/customers", customerRoutes);
adminRoutes.use("/products", productRoutes);
adminRoutes.use("/orders", orderRoutes);
adminRoutes.use("/categories", categoryRoutes);
adminRoutes.use("/settings", settingsRoutes);
adminRoutes.use("/dashboard", dashboardRoutes);

export default adminRoutes;
