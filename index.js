import "dotenv/config"; 
import express from "express";
import routes from "./src/routes/customer/index.js";
import adminRoutes from "./src/routes/admin/adminRoutes.js";
import db from "./src/models/index.js";


const app = express();
app.use(express.json());
app.use("/api", routes);
app.use("/api-admin", adminRoutes);


db.sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database đã đồng bộ!"))
  .catch(err => console.error("❌ Lỗi đồng bộ DB:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);

});
