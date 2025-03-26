const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");

const ProductItem = sequelize.define("ProductItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: Product, key: "id" }, 
    onDelete: "CASCADE" 
  },
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false },
  attributes: { type: DataTypes.JSON, allowNull: true }, // VD: {"color": "red", "size": "L"}
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});


module.exports = ProductItem;
