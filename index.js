require("dotenv").config();
const express = require("express");
const routes = require("./src/routes/customer/index");
const adminRoutes = require("./src/routes/admin/adminRoutes");
const { sequelize } = require("./src/models");

const app = express();
app.use(express.json());
app.use("/api", routes);
app.use("/api-admin", adminRoutes);


sequelize.sync({ alert: true }) 
  .then(() => console.log("✅ Database đã đồng bộ!"))
  .catch(err => console.error("❌ Lỗi đồng bộ DB:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);

});
