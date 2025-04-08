// models/Settings.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Settings extends Model {
  static associate(models) {
    // Không có mối quan hệ
  }
}

Settings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    setting_key: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    setting_value: {
      type: DataTypes.TEXT,
    },
    setting_group: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "Settings",
    tableName: "Settings",
    timestamps: false,
  }
);

export default Settings;
