// models/Review.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Review extends Model {
  static associate(models) {
    Review.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Review.belongsTo(models.Product, { foreignKey: 'product_id' });
    Review.hasMany(models.ReviewImage, { foreignKey: 'review_id' });
  }
}

Review.init(
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
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'Review',
    timestamps: false,
  }
);

export default Review;
