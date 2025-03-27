import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Category from "./Category.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  categoryId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Category, key: "id" }, 
    onDelete: "CASCADE"
  },
  totalStock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, 
  status: { type: DataTypes.ENUM("active", "inactive", "deleted"), defaultValue: "active" },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Product;
