// models/Blog.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Blog extends Model {
  static associate(models) {
    // Mối quan hệ Blog với Employee (Blog thuộc về Employee)
    Blog.belongsTo(models.Employee, { foreignKey: "author_id" });

    // Mối quan hệ Blog với BlogCategory (Nhiều-Nhiều thông qua BlogCategoryRelation)
    Blog.belongsToMany(models.BlogCategory, {
      through: models.BlogCategoryRelation,
      foreignKey: "blog_id",
    });

    // Mối quan hệ Blog với Tag (Nhiều-Nhiều thông qua BlogTag)
    Blog.belongsToMany(models.Tag, {
      through: models.BlogTag,
      foreignKey: "blog_id",
    });
  }
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    excerpt: {
      type: DataTypes.TEXT,
    },
    featured_image: {
      type: DataTypes.STRING(255),
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Employee",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING(100),
      validate: {
        isIn: [["draft", "published", "archived"]],
      },
      defaultValue: "draft",
    },
    published_at: {
      type: DataTypes.DATE,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: "Blog",
    tableName: "Blog",
    timestamps: false,
  }
);

export default Blog;
