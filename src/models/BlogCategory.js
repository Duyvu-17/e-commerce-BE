// models/BlogCategory.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class BlogCategory extends Model {
  static associate(models) {
    // Thiết lập mối quan hệ Nhiều-Nhiều giữa BlogCategory và Blog thông qua bảng BlogCategoryRelation
    BlogCategory.belongsToMany(models.Blog, { 
      through: models.BlogCategoryRelation, 
      foreignKey: 'category_id' 
    });
  }
}

BlogCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: "BlogCategory",
    tableName: "BlogCategory",
    timestamps: false,
  }
);

export default BlogCategory;
