const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PayPalInfo = sequelize.define("PayPalInfo", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = PayPalInfo;
