


import Employee from "./src/models/Employee.js";
import Role from "./src/models/Role.js";
import sequelize from './src/config/database.js';

async function createRoles() {
  // Kiểm tra xem các vai trò đã tồn tại chưa
  const roles = await Role.findAll();
  if (roles.length === 0) {
    // Tạo các vai trò nếu chưa có
    await Role.bulkCreate([
      { name: "Admin", permissions: "Quản lý hệ thống, Quản lý nhân viên" },
      { name: "Manager", permissions: "Giám sát, Quản lý các phòng ban, Xử lý báo cáo" },
      { name: "Employee", permissions: "Thực hiện công việc hàng ngày, Quản lý đơn hàng" },
      { name: "Support", permissions: "Hỗ trợ khách hàng, Giải quyết khiếu nại" },
      { name: "HR", permissions: "Quản lý nhân sự, Tuyển dụng, Đào tạo nhân viên" },
    ]);
    console.log("Roles đã được tạo.");
  }
}

async function createEmployees() {
  // Tạo các nhân viên với các vai trò khác nhau
  const roles = await Role.findAll();

  await Employee.bulkCreate([
    {
      email: "admin@example.com",
      full_name: "Admin User",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      role_id: roles.find(role => role.name === "Admin").id,
    },
    {
      email: "manager@example.com",
      full_name: "Manager User",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      role_id: roles.find(role => role.name === "Manager").id,
    },
    {
      email: "employee@example.com",
      full_name: "Employee User",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      role_id: roles.find(role => role.name === "Employee").id,
    },
    {
      email: "support@example.com",
      full_name: "Support User",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      role_id: roles.find(role => role.name === "Support").id,
    },
    {
      email: "hr@example.com",
      full_name: "HR User",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      role_id: roles.find(role => role.name === "HR").id,
    },
  ]);

  console.log("5 tài khoản nhân viên đã được tạo.");
}

async function seedDatabase() {
  try {
    // Đồng bộ hóa các mô hình và tạo dữ liệu
    await sequelize.sync();
    await createRoles();
    await createEmployees();
  } catch (error) {
    console.error("Lỗi khi seeding dữ liệu:", error);
  } finally {
    sequelize.close();
  }
}

// Chạy script tạo dữ liệu mẫu
seedDatabase();
// securepassword