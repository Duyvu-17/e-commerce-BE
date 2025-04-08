// models/Wishlist.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Wishlist extends Model {
  static associate(models) {
    Wishlist.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Wishlist.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Customer',
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'Wishlist',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['customer_id', 'product_id'],
      },
    ],
  }
);

export default Wishlist;
