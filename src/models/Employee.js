import DataTypes from "sequelize";
import sequelize from "../config/database.js";

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
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
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY, 
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM("male", "female", "other"),
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING, 
    allowNull: true,
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

export default Employee;
