const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BankTransferInfo = sequelize.define("BankTransferInfo", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  accountHolderName: { type: DataTypes.STRING, allowNull: false },
  bankName: { type: DataTypes.STRING, allowNull: false },
  accountNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  swiftCode: { type: DataTypes.STRING },
});

module.exports = BankTransferInfo;
