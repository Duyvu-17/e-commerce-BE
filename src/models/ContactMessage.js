// models/ContactMessage.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ContactMessage extends Model {
  static associate(models) {
    ContactMessage.belongsTo(models.Employee, { foreignKey: 'assigned_to' });
  }
}

ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(255),
    },
    subject: {
      type: DataTypes.STRING(255),
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(100),
      validate: {
        isIn: [['new', 'in_progress', 'responded', 'closed']],
      },
      defaultValue: 'new',
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Employee',
        key: 'id',
      },
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
    modelName: 'ContactMessage',
    tableName: 'ContactMessage',
    timestamps: false,
  }
);

export default ContactMessage;
