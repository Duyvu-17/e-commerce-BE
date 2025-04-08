// models/ProductImage.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ProductImage extends Model {
  static associate(models) {
    ProductImage.belongsTo(models.Product, { foreignKey: 'product_id' });
    ProductImage.belongsTo(models.ProductItem, { foreignKey: 'product_item_id' });
  }
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ProductItem',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Product',
        key: 'id',
      },
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'ProductImage',
    timestamps: false,
  }
);

export default ProductImage;
