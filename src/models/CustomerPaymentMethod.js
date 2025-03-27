import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Customer from "./Customer.js"; // Đảm bảo import đúng

const CustomerPaymentMethod = sequelize.define("CustomerPaymentMethod", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false }, // Đúng kiểu đặt tên
  type: { 
    type: DataTypes.ENUM("bank_transfer", "paypal", "credit_card"),
    allowNull: false,
  },
  paymentId: { type: DataTypes.INTEGER, allowNull: false }, 
});



export default CustomerPaymentMethod;
