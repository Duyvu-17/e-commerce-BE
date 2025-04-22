import "dotenv/config"; 
import express from "express";
import routes from "./src/routes/customer/index.js";
import adminRoutes from "./src/routes/admin/adminRoutes.js";
import db from "./src/models/index.js";
import cors from "cors";
import path from 'path';  
import { Server } from 'socket.io';
import http from 'http';
import chatSocketHandler from './src/socket/chatSocket.js';

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;

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

// Đồng bộ DB
db.sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database đã đồng bộ!"))
  .catch(err => console.error("❌ Lỗi đồng bộ DB:", err));

// Khởi tạo server HTTP từ express
const server = http.createServer(app);

// Khởi tạo Socket.IO với server HTTP
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
chatSocketHandler(io)

// // Xử lý kết nối Socket.IO
// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   socket.on('join_room', (roomId) => {
//     socket.join(roomId);
//     console.log(`User joined room: ${roomId}`);
//   });

//   socket.on('send_message', (data) => {
//     socket.to(data.room).emit('receive_message', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.io đang chạy trên cổng ${PORT}`);
});
