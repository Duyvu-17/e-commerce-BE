// models/Orders.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Orders extends Model {
  static associate(models) {
    Orders.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Orders.belongsTo(models.Cart, { foreignKey: 'cart_id' });
    Orders.belongsTo(models.CustomerPaymentMethod, { foreignKey: 'payment_method_id' });
    Orders.belongsTo(models.Shipping, { foreignKey: 'shipping_id' });
    Orders.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    Orders.hasMany(models.Transaction, { foreignKey: 'order_id' });
    Orders.hasMany(models.DiscountUsage, { foreignKey: 'order_id' });
    Orders.hasOne(models.ShippingAddress, { foreignKey: 'order_id' });
    Orders.hasMany(models.OrderTracking, { foreignKey: 'order_id' });
  }
}

Orders.init(
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
    cart_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cart',
        key: 'id',
      },
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CustomerPaymentMethod',
        key: 'id',
      },
    },
    shipping_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Shipping',
        key: 'id',
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    status: {
      type: DataTypes.TEXT,
      validate: {
        isIn: [['pending', 'paid', 'shipped', 'completed', 'cancelled']],
      },
    },
    order_number: {
      type: DataTypes.STRING,
      unique: true,
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
    modelName: 'Orders',
    tableName: 'Orders',
    timestamps: false,
  }
);

export default Orders;
