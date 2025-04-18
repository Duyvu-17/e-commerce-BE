import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ChatMessage extends Model {
  static associate(models) {
    ChatMessage.belongsTo(models.ChatConversation, { foreignKey: "conversation_id" });
  }
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_type: {
      type: DataTypes.ENUM("customer", "employee"),
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ChatMessage",
    tableName: "ChatMessage",
    timestamps: false,
  }
);

export default ChatMessage;
