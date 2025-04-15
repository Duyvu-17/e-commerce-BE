import "dotenv/config"; 
import express from "express";
import routes from "./src/routes/customer/index.js";
import adminRoutes from "./src/routes/admin/adminRoutes.js";
import db from "./src/models/index.js";
import cors from "cors";
import path from 'path';  

const app = express();

// Cấu hình CORS để cho phép frontend truy cập từ các nguồn khác
app.use(cors());

// Thêm middleware để thiết lập Referrer-Policy
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middleware để parse dữ liệu JSON từ frontend
app.use(express.json());

// Các route API của bạn
app.use("/api", routes);
app.use("/api-admin", adminRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


db.sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database đã đồng bộ!"))
  .catch(err => console.error("❌ Lỗi đồng bộ DB:", err));

// Lắng nghe server trên cổng 3000 hoặc cổng được cấu hình trong .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
