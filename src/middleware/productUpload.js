import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Biến tương đương với __dirname khi dùng ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn thư mục gốc chứa uploads
const rootUploadPath = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    console.log(`[UPLOAD] Nhận file từ field: ${file.fieldname}`);

    if (file.fieldname === 'image') {
      uploadPath = path.join(rootUploadPath, 'product');
    } else if (file.fieldname.startsWith('productItem_')) {
      uploadPath = path.join(rootUploadPath, 'product_items');
    } else {
      uploadPath = path.join(rootUploadPath, 'temp');
    }

    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log(`[UPLOAD] Tạo/thấy thư mục: ${uploadPath}`);
      cb(null, uploadPath);
    } catch (err) {
      console.error('[UPLOAD ERROR] Lỗi tạo thư mục:', err);
      cb(err, uploadPath);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log(`[UPLOAD] Lưu với tên file: ${filename}`);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log(`[FILTER] Kiểm tra file: ${file.originalname}, mimetype: ${file.mimetype}`);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    const err = new Error('Chỉ chấp nhận file hình ảnh!');
    console.error('[FILTER ERROR]', err.message);
    cb(err, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Bạn có thể mở rộng thêm nếu có nhiều hơn
export const productUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'productItem_0_image', maxCount: 1 },
  { name: 'productItem_1_image', maxCount: 1 },
  { name: 'productItem_2_image', maxCount: 1 }
]);
