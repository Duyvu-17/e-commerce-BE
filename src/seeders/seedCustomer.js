import Customer from "../models/Customer.js";
import CustomerInfo from "../models/CustomerInfo.js";
import sequelize from '../config/database.js';

async function createCustomers() {
  // Tạo 10 khách hàng mẫu
  await Customer.bulkCreate([
    {
      email: "customer1@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS", // Mật khẩu đã mã hóa (đảm bảo sử dụng thư viện để mã hóa mật khẩu)
      isVerified: true,
      status: "active",
    },
    {
      email: "customer2@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: true,
      status: "active",
    },
    {
      email: "customer3@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: false,
      status: "inactive",
    },
    {
      email: "customer4@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: true,
      status: "active",
    },
    {
      email: "customer5@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: true,
      status: "active",
    },
    {
      email: "customer6@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: false,
      status: "inactive",
    },
    {
      email: "customer7@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: true,
      status: "active",
    },
    {
      email: "customer8@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: true,
      status: "active",
    },
    {
      email: "customer9@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: false,
      status: "banned",
    },
    {
      email: "customer10@example.com",
      password: "$2y$10$7Fs5FOMJ8vo5dlfe.Lmo2Oo4Ztr0oSolgRoNgcZkxkWaIAzgRw.YS",
      isVerified: true,
      status: "active",
    },
  ]);

  console.log("10 khách hàng đã được tạo.");
}

async function createCustomerInfo() {
  // Tạo thông tin cho mỗi khách hàng
  const customers = await Customer.findAll();

  const customerInfoData = customers.map(customer => ({
    customer_id: customer.id,
    avatar: "https://example.com/avatar.png",
    fullname: `${customer.email.split('@')[0]} Fullname`,
    first_name: customer.email.split('@')[0],
    last_name: "Lastname",
    birth_date: new Date(1990, 1, 1), // Ngày sinh mẫu
    phone_number: "1234567890",
  }));

  await CustomerInfo.bulkCreate(customerInfoData);

  console.log("Thông tin khách hàng đã được tạo.");
}

async function seedDatabase() {
  try {
    // Đồng bộ hóa các mô hình và tạo dữ liệu
    await sequelize.sync();
    await createCustomers();
    await createCustomerInfo();
  } catch (error) {
    console.error("Lỗi khi seeding dữ liệu:", error);
  } finally {
    sequelize.close();
  }
}

// Chạy script tạo dữ liệu mẫu
seedDatabase();
