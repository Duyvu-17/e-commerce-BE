import express from "express";
import productController from "../../controllers/admin/productController.js";
import { productUpload } from './../../middleware/productUpload.js';
import multer from 'multer';


const router = express.Router();


router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
// router.post("/", uploadMultipleImages, productController.createProduct);
// router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);


router.post('/', (req, res, next) => {
  productUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('[MULTER ERROR]', err.message);
      return res.status(400).json({ error: 'Multer error', message: err.message });
    } else if (err) {
      console.error('[UPLOAD ERROR]', err.message);
      return res.status(400).json({ error: 'Upload error', message: err.message });
    }

    console.log('[UPLOAD] Thành công! req.files:', req.files);
    next(); // Gọi controller khi không có lỗi
  });
}, productController.createProduct);

router.put('/:id', (req, res, next) => {
  productUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('[MULTER ERROR]', err.message);
      return res.status(400).json({ error: 'Multer error', message: err.message });
    } else if (err) {
      console.error('[UPLOAD ERROR]', err.message);
      return res.status(400).json({ error: 'Upload error', message: err.message });
    }

    console.log('[UPLOAD] Thành công! req.files:', req.files);
    next(); // Gọi controller khi không có lỗi
  });
}, productController.updateProduct);



export default router;
