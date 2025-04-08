// models/BlogTag.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class BlogTag extends Model {
  static associate(models) {
    // No additional associations needed as this is a through table
  }
}

BlogTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Blog',
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tag',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'BlogTag',
    tableName: 'BlogTag',
    timestamps: false,
  }
);

export default BlogTag;
