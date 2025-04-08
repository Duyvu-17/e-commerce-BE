// models/ProductTag.js
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class ProductTag extends Model {
  static associate(models) {
    // No additional associations needed as this is a through table
  }
}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Product',
        key: 'id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tag',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ProductTag',
    tableName: 'ProductTag',
    timestamps: false,
  }
);

export default ProductTag;
