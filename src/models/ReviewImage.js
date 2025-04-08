// models/ReviewImage.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ReviewImage extends Model {
  static associate(models) {
    ReviewImage.belongsTo(models.Review, { foreignKey: 'review_id' });
  }
}

ReviewImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    review_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Review',
        key: 'id',
      },
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
  },
  {
    sequelize,
    modelName: 'ReviewImage',
    tableName: 'ReviewImage',
    timestamps: false,
  }
);

export default ReviewImage;
