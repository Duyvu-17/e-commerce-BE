// models/InventoryHistory.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class InventoryHistory extends Model {
  static associate(models) {
    // Mối quan hệ InventoryHistory thuộc về Inventory và Employee
    InventoryHistory.belongsTo(models.Inventory, { foreignKey: "inventory_id" });
    InventoryHistory.belongsTo(models.Employee, { foreignKey: "changed_by" });
  }
}

InventoryHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Inventory",
        key: "id",
      },
    },
    previous_quantity: {
      type: DataTypes.INTEGER,
    },
    new_quantity: {
      type: DataTypes.INTEGER,
    },
    change_reason: {
      type: DataTypes.TEXT,
    },
    changed_by: {
      type: DataTypes.INTEGER,
      references: {
        model: "Employee",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "InventoryHistory",
    tableName: "InventoryHistory",
    timestamps: false,
  }
);

export default InventoryHistory;
