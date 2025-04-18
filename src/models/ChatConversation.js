import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ChatConversation extends Model {
  static associate(models) {
    ChatConversation.belongsTo(models.Customer, { foreignKey: "customer_id" });
    ChatConversation.belongsTo(models.Employee, { foreignKey: "employee_id" });
    ChatConversation.hasMany(models.ChatMessage, { foreignKey: "conversation_id" });
  }
}

ChatConversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // chưa gán cũng được
    },
    status: {
      type: DataTypes.ENUM("active", "closed"),
      defaultValue: "active",
    },
    last_message: {
      type: DataTypes.STRING(500),
    },
    last_message_time: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ChatConversation",
    tableName: "ChatConversation",
    timestamps: false,
  }
);

export default ChatConversation;
