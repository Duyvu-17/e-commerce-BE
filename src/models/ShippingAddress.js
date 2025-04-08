// models/ShippingAddress.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ShippingAddress extends Model {
  static associate(models) {
    // Mối quan hệ: ShippingAddress thuộc về Orders
    ShippingAddress.belongsTo(models.Orders, { foreignKey: "order_id" });
  }
}

ShippingAddress.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING(255),
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ShippingAddress",
    tableName: "ShippingAddress",
    timestamps: false,
  }
);

export default ShippingAddress;
