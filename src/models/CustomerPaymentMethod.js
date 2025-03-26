const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CustomerPaymentMethod = sequelize.define("CustomerPaymentMethod", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { 
    type: DataTypes.ENUM("bank_transfer", "paypal", "credit_card"),
    allowNull: false,
  },
  paymentId: { type: DataTypes.INTEGER, allowNull: false }, 
});

module.exports = CustomerPaymentMethod;
