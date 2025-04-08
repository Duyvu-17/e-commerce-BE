// models/Inventory.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Inventory extends Model {
  static associate(models) {
    // Mối quan hệ Inventory thuộc về ProductItem và có nhiều InventoryHistory
    Inventory.belongsTo(models.ProductItem, { foreignKey: "product_item_id" });
    Inventory.hasMany(models.InventoryHistory, { foreignKey: "inventory_id" });
  }
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ProductItem",
        key: "id",
      },
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    low_stock_threshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    last_check: {
      type: DataTypes.DATE,
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
    modelName: "Inventory",
    tableName: "Inventory",
    timestamps: false,
  }
);

export default Inventory;
