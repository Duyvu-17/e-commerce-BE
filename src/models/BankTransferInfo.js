import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";


const BankTransferInfo = sequelize.define("BankTransferInfo", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  accountHolderName: { type: DataTypes.STRING, allowNull: false },
  bankName: { type: DataTypes.STRING, allowNull: false },
  accountNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  swiftCode: { type: DataTypes.STRING },
});

export default BankTransferInfo;
