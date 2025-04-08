// models/Tag.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Tag extends Model {
  static associate(models) {
    // Mối quan hệ Nhiều-Nhiều giữa Tag và Product thông qua bảng ProductTag
    Tag.belongsToMany(models.Product, {
      through: models.ProductTag,
      foreignKey: "tag_id",
    });

    // Mối quan hệ Nhiều-Nhiều giữa Tag và Blog thông qua bảng BlogTag
    Tag.belongsToMany(models.Blog, {
      through: models.BlogTag,
      foreignKey: "tag_id",
    });
  }
}

Tag.init(
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "Tag",
    timestamps: false,
  }
);

export default Tag;
