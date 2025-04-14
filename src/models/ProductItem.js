// models/ProductItem.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ProductItem extends Model {
  static associate(models) {
    ProductItem.belongsTo(models.Product, { foreignKey: 'product_id' });
    ProductItem.hasMany(models.ProductImage, { foreignKey: 'product_item_id' });
    ProductItem.hasMany(models.CartItem, { foreignKey: 'product_item_id' });
    ProductItem.hasMany(models.OrderItem, { foreignKey: 'product_item_id' });
    ProductItem.hasOne(models.Inventory, { foreignKey: 'product_item_id' });
  }
}

ProductItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    dimensions: {
      type: DataTypes.STRING(255),
    },
    attributes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING(255), 
      unique: true, 
    },

    status: {
      type: DataTypes.STRING(255),
      validate: {
        isIn: [['out of stock', 'in stock', 'low stock']],
      },
      defaultValue: 'active',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    color: {
      type: DataTypes.STRING(100),
    },
    size: {
      type: DataTypes.STRING(100),
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
    modelName: 'ProductItem',
    tableName: 'ProductItem',
    timestamps: false,
  }
);

export default ProductItem;
