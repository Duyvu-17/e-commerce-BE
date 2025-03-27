import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Product from "./Product.js";

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
  discountPrice: { type: DataTypes.DECIMAL(10,2), allowNull: true }, 
  qty: { type: DataTypes.INTEGER, allowNull: false }, 
  weight: { type: DataTypes.FLOAT, allowNull: true }, 
  dimensions: { type: DataTypes.JSON, allowNull: true }, 
  attributes: { type: DataTypes.JSON, allowNull: true }, 
  status: { type: DataTypes.ENUM("active", "inactive", "out_of_stock"), defaultValue: "active" },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

ProductItem.afterSave(async (productItem, options) => {
  const totalStock = await ProductItem.sum("qty", { where: { productId: productItem.productId } });
  await Product.update({ totalStock }, { where: { id: productItem.productId } });
});

ProductItem.afterDestroy(async (productItem, options) => {
  const totalStock = await ProductItem.sum("qty", { where: { productId: productItem.productId } });
  await Product.update({ totalStock }, { where: { id: productItem.productId } });
});

export default ProductItem;
