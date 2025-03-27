import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";
import Cart from "./Cart.js";
import ProductItem from "./ProductItem.js";

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Carts",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  productItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "ProductItems",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

CartItem.associate = () => {
  CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });
  CartItem.belongsTo(ProductItem, {
    foreignKey: "productItemId",
    as: "productItem",
  });
};

export default CartItem;
