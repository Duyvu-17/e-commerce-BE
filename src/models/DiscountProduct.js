// models/DiscountProduct.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class DiscountProduct extends Model {
  static associate(models) {
    // Đây là bảng trung gian, không cần thêm mối quan hệ bổ sung
  }
}

DiscountProduct.init(
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
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Product',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'DiscountProduct',
    tableName: 'DiscountProduct',
    timestamps: false,
  }
);

export default DiscountProduct;
