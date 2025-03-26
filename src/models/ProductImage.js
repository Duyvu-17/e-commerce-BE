const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ProductItem = require("./ProductItem");

const ProductImage = sequelize.define("ProductImage", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productItemId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: ProductItem, key: "id" }, 
    onDelete: "CASCADE" 
  },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});



module.exports = ProductImage;
