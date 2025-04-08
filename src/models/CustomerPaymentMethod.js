// models/CustomerPaymentMethod.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class CustomerPaymentMethod extends Model {
  static associate(models) {
    CustomerPaymentMethod.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    CustomerPaymentMethod.hasOne(models.CreditCardInfo, { foreignKey: 'payment_method_id' });
    CustomerPaymentMethod.hasOne(models.PayPalInfo, { foreignKey: 'payment_method_id' });
    CustomerPaymentMethod.hasOne(models.BankTransferInfo, { foreignKey: 'payment_method_id' });
    CustomerPaymentMethod.hasMany(models.Orders, { foreignKey: 'payment_method_id' });
    CustomerPaymentMethod.hasMany(models.Transaction, { foreignKey: 'payment_method_id' });
  }
}

CustomerPaymentMethod.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
        key: 'id',
      },
    },
    method_type: {
      type: DataTypes.TEXT,
      validate: {
        isIn: [['credit_card', 'paypal', 'bank_transfer']],
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'CustomerPaymentMethod',
    tableName: 'CustomerPaymentMethod',
    timestamps: false,
  }
);

export default CustomerPaymentMethod;
