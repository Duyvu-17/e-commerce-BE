// models/BlogCategoryRelation.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class BlogCategoryRelation extends Model {
  static associate(models) {
    // Không cần thêm mối quan hệ vì đây là một bảng "through" (liên kết giữa hai bảng)
  }
}

BlogCategoryRelation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Blog",  // Tham chiếu đến bảng Blog
        key: "id",
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "BlogCategory",  // Tham chiếu đến bảng BlogCategory
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "BlogCategoryRelation",
    tableName: "BlogCategoryRelation",
    timestamps: false,
  }
);

export default BlogCategoryRelation;
