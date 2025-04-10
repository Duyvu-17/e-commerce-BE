// models/Product.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Product extends Model {
  static associate(models) {
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.hasMany(models.ProductItem, { foreignKey: 'product_id' });
    Product.hasMany(models.ProductImage, { foreignKey: 'product_id' });
    Product.hasMany(models.Wishlist, { foreignKey: 'product_id' });
    Product.hasMany(models.Review, { foreignKey: 'product_id' });
    Product.belongsToMany(models.Discount, { through: models.DiscountProduct, foreignKey: 'product_id' });
    Product.belongsToMany(models.Tag, { through: models.ProductTag, foreignKey: 'product_id' });
  }
}

Product.init(
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
    summary: {
      type: DataTypes.TEXT,
    },
    slug: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING(255),
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    sku: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    barcode: {
      type: DataTypes.STRING(255), 
      unique: true, 
    },
    status: {
      type: DataTypes.STRING(255),
      validate: {
        isIn: [['active', 'inactive', 'deleted']],
      },
      defaultValue: 'active',
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'Product',
    timestamps: false, 
    underscored: true, 
  }
);

export default Product;
