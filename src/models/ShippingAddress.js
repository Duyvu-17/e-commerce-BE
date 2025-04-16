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
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    full_name: { type: DataTypes.STRING(255), allowNull: false },
    street_address: { type: DataTypes.STRING(255), allowNull: false },
    district: { type: DataTypes.STRING(100), allowNull: false },
    ward: { type: DataTypes.STRING(100) }, 
    phone_number: { type: DataTypes.STRING(20), allowNull: false },
  },
  {
    sequelize,
    modelName: "ShippingAddress",
    tableName: "ShippingAddress",
    timestamps: false,
  }
);


export default ShippingAddress;
