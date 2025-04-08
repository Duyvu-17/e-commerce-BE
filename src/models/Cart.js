// models/Cart.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Cart extends Model {
  static associate(models) {
    Cart.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
    Cart.hasMany(models.Orders, { foreignKey: 'cart_id' });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Customer',
        key: 'id',
      },
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
    modelName: 'Cart',
    tableName: 'Cart',
    timestamps: false,
  }
);

export default Cart;
