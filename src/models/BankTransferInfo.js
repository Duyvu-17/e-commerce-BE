// models/BankTransferInfo.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class BankTransferInfo extends Model {
  static associate(models) {
    BankTransferInfo.belongsTo(models.CustomerPaymentMethod, { foreignKey: 'payment_method_id' });
  }
}

BankTransferInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CustomerPaymentMethod',
        key: 'id',
      },
    },
    bank_name: {
      type: DataTypes.STRING(255),
    },
    account_number: {
      type: DataTypes.STRING(50),
    },
    account_holder_name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: 'BankTransferInfo',
    tableName: 'BankTransferInfo',
    timestamps: false,
  }
);

export default BankTransferInfo;
