// models/Transaction.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Transaction extends Model {
  static associate(models) {
    Transaction.belongsTo(models.Orders, { foreignKey: 'order_id' });
    Transaction.belongsTo(models.CustomerPaymentMethod, { foreignKey: 'payment_method_id' });
  }
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
      },
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CustomerPaymentMethod',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      validate: {
        isIn: [['pending', 'completed', 'failed', 'refunded']],
      },
    },
    transaction_reference: {
      type: DataTypes.STRING(255),
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transaction',
    timestamps: false,
  }
);

export default Transaction;
