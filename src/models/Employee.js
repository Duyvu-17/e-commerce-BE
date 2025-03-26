const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("super-admin", "admin", "moderator", "staff"),
    defaultValue: "staff",
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "banned"),
    defaultValue: "active",
  },
});

module.exports = Employee;
