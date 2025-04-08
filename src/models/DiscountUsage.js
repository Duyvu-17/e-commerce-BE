// models/DiscountUsage.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class DiscountUsage extends Model {
  static associate(models) {
    // Mối quan hệ DiscountUsage thuộc về Discount, Customer và Orders
    DiscountUsage.belongsTo(models.Discount, { foreignKey: "discount_id" });
    DiscountUsage.belongsTo(models.Customer, { foreignKey: "customer_id" });
    DiscountUsage.belongsTo(models.Orders, { foreignKey: "order_id" });
  }
}

DiscountUsage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    discount_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Discount",
        key: "id",
      },
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Customer",
        key: "id",
      },
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    used_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "DiscountUsage",
    tableName: "DiscountUsage",
    timestamps: false,
  }
);

export default DiscountUsage;
