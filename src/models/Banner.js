// models/Banner.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Banner extends Model {
  static associate(models) {
    // Không có mối quan hệ nào thêm ở đây
  }
}

Banner.init(
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
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    redirect_url: {
      type: DataTypes.STRING(255),
    },
    position: {
      type: DataTypes.STRING(100),
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING(100),
      validate: {
        isIn: [['active', 'inactive', 'scheduled']],
      },
      defaultValue: 'active',
    },
    priority: {
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
    modelName: 'Banner',
    tableName: 'Banner',
    timestamps: false,
  }
);

export default Banner;
