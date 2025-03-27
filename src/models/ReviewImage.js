import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Review from "./Review.js";

const ReviewImage = sequelize.define("ReviewImage", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Review,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  filename: {  
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default ReviewImage;
