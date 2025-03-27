import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";


const CustomerPaymentMethod = sequelize.define("CustomerPaymentMethod", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { 
    type: DataTypes.ENUM("bank_transfer", "paypal", "credit_card"),
    allowNull: false,
  },
  paymentId: { type: DataTypes.INTEGER, allowNull: false }, 
});

export default CustomerPaymentMethod;
