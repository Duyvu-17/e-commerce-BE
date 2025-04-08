// models/CreditCardInfo.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class CreditCardInfo extends Model {
  static associate(models) {
    CreditCardInfo.belongsTo(models.CustomerPaymentMethod, { foreignKey: 'payment_method_id' });
  }
}

CreditCardInfo.init(
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
    card_number: {
      type: DataTypes.STRING(20),
    },
    expiry_date: {
      type: DataTypes.DATE,
    },
    cvv: {
      type: DataTypes.STRING(10),
    },
    cardholder_name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: 'CreditCardInfo',
    tableName: 'CreditCardInfo',
    timestamps: false,
  }
);

export default CreditCardInfo;
