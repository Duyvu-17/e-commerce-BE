import  DataTypes from "sequelize";
import sequelize from "../config/database.js";
import ProductItem from "./ProductItem.js";


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



export default ProductImage;
