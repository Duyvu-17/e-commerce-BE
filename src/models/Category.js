// models/Category.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Category extends Model {
  static associate(models) {
    Category.hasMany(models.Product, { foreignKey: 'category_id' });
    Category.belongsToMany(models.Discount, { through: models.DiscountCategory, foreignKey: 'category_id' });
  }
}

Category.init(
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
    image: {
      type: DataTypes.STRING(255),
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
    modelName: 'category',
    tableName: 'Category',
    timestamps: false,
  }
);

export default Category;
