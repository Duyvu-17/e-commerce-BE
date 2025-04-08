// models/DiscountCategory.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class DiscountCategory extends Model {
  static associate(models) {
    // No additional associations needed as this is a through table
  }
}

DiscountCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    discount_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Discount',
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'DiscountCategory',
    tableName: 'DiscountCategory',
    timestamps: false,
  }
);

export default DiscountCategory;
