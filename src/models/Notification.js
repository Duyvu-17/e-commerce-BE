// models/Notification.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Notification extends Model {
  static associate(models) {
    Notification.belongsTo(models.Customer, { foreignKey: 'customer_id' });
  }
}

Notification.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notification_type: {
      type: DataTypes.TEXT,
      validate: {
        isIn: [['order', 'product', 'promotion', 'system', 'other']],
      },
    },
    related_id: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notification',
    timestamps: false,
  }
);

export default Notification;
