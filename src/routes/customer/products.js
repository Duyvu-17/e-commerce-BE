import express from "express";
import productController from "../../controllers/customer/productController.js"; // Thêm `.js`

const router = express.Router();


router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

export default router;
