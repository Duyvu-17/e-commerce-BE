// models/OrderTracking.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class OrderTracking extends Model {
  static associate(models) {
    OrderTracking.belongsTo(models.Orders, { foreignKey: 'order_id' });
    OrderTracking.belongsTo(models.Employee, { foreignKey: 'updated_by' });
  }
}

OrderTracking.init(
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
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING(255),
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Employee',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'OrderTracking',
    tableName: 'OrderTracking',
    timestamps: false,
  }
);

export default OrderTracking;
