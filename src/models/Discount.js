// models/Discount.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Discount extends Model {
  static associate(models) {
    Discount.belongsToMany(models.Product, { through: models.DiscountProduct, foreignKey: 'discount_id' });
    Discount.belongsToMany(models.Category, { through: models.DiscountCategory, foreignKey: 'discount_id' });
    Discount.hasMany(models.OrderItem, { foreignKey: 'discount_id' });
    Discount.hasMany(models.DiscountUsage, { foreignKey: 'discount_id' });
  }
}

Discount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    discount_type: {
      type: DataTypes.TEXT,
      validate: {
        isIn: [['percentage', 'fixed_amount', 'free_shipping']],
      },
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
    },
    minimum_purchase: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
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
    modelName: 'Discount',
    tableName: 'Discount',
    timestamps: false,
  }
);

export default Discount;
