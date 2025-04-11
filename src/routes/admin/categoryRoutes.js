import express from "express";
import categoryController from "../../controllers/admin/categoryController.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", upload.single("image"), categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
