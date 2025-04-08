// models/CartItem.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class CartItem extends Model {
  static associate(models) {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id' });
    CartItem.belongsTo(models.ProductItem, { foreignKey: 'product_item_id' });
  }
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cart',
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
    modelName: 'CartItem',
    tableName: 'CartItem',
    timestamps: false,
  }
);

export default CartItem;
