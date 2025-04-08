// models/OrderItem.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class OrderItem extends Model {
  static associate(models) {
    OrderItem.belongsTo(models.Orders, { foreignKey: 'order_id' });
    OrderItem.belongsTo(models.ProductItem, { foreignKey: 'product_item_id' });
    OrderItem.belongsTo(models.Discount, { foreignKey: 'discount_id' });
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id',
      },
    },
    product_item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ProductItem',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    discount_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Discount',
        key: 'id',
      },
    },
    discounted_price: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItem',
    timestamps: false,
  }
);

export default OrderItem;
