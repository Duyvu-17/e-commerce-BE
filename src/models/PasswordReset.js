import DataTypes from "sequelize";
import sequelize from "../config/database.js";
import Customer from "./Customer.js";

const PasswordReset = sequelize.define("PasswordReset", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  customerId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('password_reset', 'account_recovery'),
    allowNull: false,
    defaultValue: 'password_reset'
  },
  ipAddress: {
    type: DataTypes.STRING(45), // IPv6 support
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['customerId', 'used', 'createdAt']
    },
    {
      unique: true,
      fields: ['token']
    }
  ],
  timestamps: true
});



export default PasswordReset;