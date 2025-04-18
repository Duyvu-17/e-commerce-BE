import Employee from "../models/Employee.js";
import Role from "../models/Role.js";
import sequelize from "../config/database.js";

async function createRoles() {
  const roles = await Role.findAll();
  if (roles.length === 0) {
    await Role.bulkCreate([
      { name: "Admin", permissions: "Quản lý hệ thống, Quản lý nhân viên" },
      { name: "Manager", permissions: "Giám sát, Quản lý các phòng ban, Xử lý báo cáo" },
      { name: "Employee", permissions: "Thực hiện công việc hàng ngày, Quản lý đơn hàng" },
      { name: "Support", permissions: "Hỗ trợ khách hàng, Giải quyết khiếu nại" },
      { name: "HR", permissions: "Quản lý nhân sự, Tuyển dụng, Đào tạo nhân viên" },
    ]);
    console.log("✅ Roles đã được tạo.");
  }
}

async function createEmployees() {
  const roles = await Role.findAll();
  const getRoleId = (roleName) => roles.find(role => role.name === roleName)?.id;

  const hashedPassword = "$2y$10$qabfJSz1KcasZOFNN0cBvOwziVK.6TJgiiy5f8IaJtoNZsvv7Et5m"; 

  const employees = [
    // 5 cố định
    { email: "admin@example.com", full_name: "Admin User", password: hashedPassword, role_id: getRoleId("Admin") },
    { email: "manager@example.com", full_name: "Manager User", password: hashedPassword, role_id: getRoleId("Manager") },
    { email: "employee@example.com", full_name: "Employee User", password: hashedPassword, role_id: getRoleId("Employee") },
    { email: "support@example.com", full_name: "Support User", password: hashedPassword, role_id: getRoleId("Support") },
    { email: "hr@example.com", full_name: "HR User", password: hashedPassword, role_id: getRoleId("HR") },

    // 15 người bổ sung thủ công
    { email: "john.doe1@example.com", full_name: "John Doe", password: hashedPassword, role_id: getRoleId("Employee") },
    { email: "jane.smith1@example.com", full_name: "Jane Smith", password: hashedPassword, role_id: getRoleId("Support") },
    { email: "mike.jordan@example.com", full_name: "Mike Jordan", password: hashedPassword, role_id: getRoleId("HR") },
    { email: "susan.white@example.com", full_name: "Susan White", password: hashedPassword, role_id: getRoleId("Manager") },
    { email: "tony.nguyen@example.com", full_name: "Tony Nguyen", password: hashedPassword, role_id: getRoleId("Employee") },
    { email: "ha.tran@example.com", full_name: "Hà Trần", password: hashedPassword, role_id: getRoleId("Support") },
    { email: "anh.le@example.com", full_name: "Anh Lê", password: hashedPassword, role_id: getRoleId("HR") },
    { email: "bao.pham@example.com", full_name: "Bảo Phạm", password: hashedPassword, role_id: getRoleId("Employee") },
    { email: "linh.nguyen@example.com", full_name: "Linh Nguyễn", password: hashedPassword, role_id: getRoleId("Support") },
    { email: "quang.vo@example.com", full_name: "Quang Võ", password: hashedPassword, role_id: getRoleId("Manager") },
    { email: "nhu.nguyen@example.com", full_name: "Như Nguyễn", password: hashedPassword, role_id: getRoleId("HR") },
    { email: "hoang.minh@example.com", full_name: "Hoàng Minh", password: hashedPassword, role_id: getRoleId("Employee") },
    { email: "bao.ho@example.com", full_name: "Bảo Hồ", password: hashedPassword, role_id: getRoleId("Support") },
    { email: "viet.tran@example.com", full_name: "Việt Trần", password: hashedPassword, role_id: getRoleId("HR") },
    { email: "tam.nguyen@example.com", full_name: "Tâm Nguyễn", password: hashedPassword, role_id: getRoleId("Employee") },
  ];

  await Employee.bulkCreate(employees);
  console.log("✅ Đã tạo 20 tài khoản nhân viên.");
}

async function seedDatabase() {
  try {
    await sequelize.sync();
    await createRoles();
    await createEmployees();
  } catch (error) {
    console.error("❌ Lỗi khi seeding dữ liệu:", error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
