// models/Shipping.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Shipping extends Model {
  static associate(models) {
    Shipping.hasMany(models.Orders, { foreignKey: 'shipping_id' });
  }
}

Shipping.init(
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
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    estimated_days: {
      type: DataTypes.INTEGER,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: 'Shipping',
    tableName: 'Shipping',
    timestamps: false,
  }
);

export default Shipping;
