// models/PayPalInfo.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class PayPalInfo extends Model {
  static associate(models) {
    PayPalInfo.belongsTo(models.CustomerPaymentMethod, { foreignKey: 'payment_method_id' });
  }
}

PayPalInfo.init(
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
    paypal_email: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: 'PayPalInfo',
    tableName: 'PayPalInfo',
    timestamps: false,
  }
);

export default PayPalInfo;
