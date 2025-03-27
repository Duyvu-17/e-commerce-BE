import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import ProductItem from "./ProductItem.js";
import Product from "./Product.js";

const ProductImage = sequelize.define("ProductImage", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
    references: { model: Product, key: "id" }, 
    onDelete: "CASCADE"
  },
  productItemId: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
    references: { model: ProductItem, key: "id" }, 
    onDelete: "CASCADE" 
  },
  imageUrl: { type: DataTypes.STRING, allowNull: false, unique: true }, // Đảm bảo ảnh không bị trùng
  isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

ProductImage.beforeValidate((productImage) => {
  if (!productImage.productId && !productImage.productItemId) {
    throw new Error("ProductImage phải thuộc về một Product hoặc một ProductItem.");
  }
});

ProductImage.beforeSave(async (productImage, options) => {
  if (productImage.isPrimary) {
    await ProductImage.update(
      { isPrimary: false },
      { 
        where: { 
          productId: productImage.productId || null,
          productItemId: productImage.productItemId || null
        }
      }
    );
  }
});

export default ProductImage;
