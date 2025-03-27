import  DataTypes from "sequelize";
import sequelize from "../config/database.js";


const PayPalInfo = sequelize.define("PayPalInfo", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
});

export default PayPalInfo;
